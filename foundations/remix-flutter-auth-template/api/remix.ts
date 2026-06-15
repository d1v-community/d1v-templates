import { once } from "node:events";
import type { IncomingMessage, ServerResponse } from "node:http";
import { Readable } from "node:stream";
import { createReadableStreamFromReadable, createRequestHandler } from "@remix-run/node";

// @ts-ignore generated at build time
import * as build from "../build/server/index.js";

function fromNodeHeaders(nodeHeaders: IncomingMessage["headers"]) {
  const headers = new Headers();
  for (const [key, values] of Object.entries(nodeHeaders)) {
    if (!values) continue;
    if (Array.isArray(values)) {
      for (const value of values) headers.append(key, value);
    } else {
      headers.set(key, values);
    }
  }
  return headers;
}

function toWebRequest(req: IncomingMessage, res: ServerResponse) {
  const host = req.headers.host ?? "localhost";
  const origin = req.headers.origin && req.headers.origin !== "null" ? req.headers.origin : `https://${host}`;
  const requestUrl = new URL(req.url ?? "/", origin);
  const controller = new AbortController();
  const init: RequestInit & { duplex?: "half" } = {
    headers: fromNodeHeaders(req.headers),
    method: req.method,
    signal: controller.signal,
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = createReadableStreamFromReadable(req);
    init.duplex = "half";
  }

  res.on("finish", () => controller.abort());
  res.on("close", () => controller.abort());
  return new Request(requestUrl.href, init);
}

async function sendNodeResponse(webResponse: Response, res: ServerResponse) {
  res.statusCode = webResponse.status;
  res.statusMessage = webResponse.statusText;

  const setCookies: string[] = [];
  for (const [key, value] of webResponse.headers.entries()) {
    if (key.toLowerCase() === "set-cookie") setCookies.push(value);
    else res.setHeader(key, value);
  }

  if (setCookies.length > 0) res.setHeader("set-cookie", setCookies);

  if (!webResponse.body) {
    res.end();
    return;
  }

  const body = Readable.fromWeb(webResponse.body as never);
  body.pipe(res);
  await once(body, "end");
}

const handleRequest = createRequestHandler(build as never, process.env.NODE_ENV);

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const request = toWebRequest(req, res);
  const response = await handleRequest(request);
  await sendNodeResponse(response, res);
}
