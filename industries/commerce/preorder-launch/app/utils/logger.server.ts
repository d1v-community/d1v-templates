import pino from "pino";
import { env } from "./env.server";

const logger = pino({ level: env.LOG_LEVEL, base: undefined });

export function getLogger(requestId?: string) {
  return requestId ? logger.child({ requestId }) : logger;
}

export type Logger = ReturnType<typeof getLogger>;
