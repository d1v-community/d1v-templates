import Taro from '@tarojs/taro'
import { STORAGE_KEYS } from '../storage/keys'
import { getStorageString, removeStorage } from '../storage/storage'

const DEFAULT_MINI_PROGRAM_API_BASE = 'https://www.yuezhihui.xyz'

function readRuntimeEnv(name: string): string {
  const runtimeProcess =
    typeof globalThis !== 'undefined' && 'process' in globalThis
      ? (globalThis as typeof globalThis & { process?: { env?: Record<string, unknown> } }).process
      : undefined
  const value = runtimeProcess?.env?.[name]
  return typeof value === 'string' ? value.trim() : ''
}

function getApiBaseUrl(): string {
  // H5 is served under Remix at `/app/*`, so same-origin `/api/*` works.
  if (Taro.getEnv() === Taro.ENV_TYPE.WEB) return ''

  // Mini-program requires a full domain. Prefer build-time env, then fall back
  // to the production domain so uploaded bundles still have a usable API host.
  const base = readRuntimeEnv('TARO_APP_API_BASE')
  if (base) return base.replace(/\/+$/, '')
  return DEFAULT_MINI_PROGRAM_API_BASE
}

type ApiRequestOptions = {
  path: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  data?: any
}

export async function apiRequest<T>(opts: ApiRequestOptions): Promise<T> {
  const baseUrl = getApiBaseUrl()
  const token = getStorageString(STORAGE_KEYS.authToken)
  const url = `${baseUrl}${opts.path}`

  const res = await Taro.request<T>({
    url,
    method: opts.method ?? 'GET',
    data: opts.data,
    header: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  // Basic auth recovery: if server returns 401, clear token.
  // (Do not auto-redirect here; keep it UI-driven.)
  if (res.statusCode === 401) {
    removeStorage(STORAGE_KEYS.authToken)
  }

  return res.data
}
