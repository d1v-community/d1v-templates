import Taro from '@tarojs/taro'

export function getStorageString(key: string): string | null {
  try {
    const v = Taro.getStorageSync(key)
    if (typeof v === 'string' && v.length > 0) return v
    return null
  } catch {
    return null
  }
}

export function setStorageString(key: string, value: string) {
  Taro.setStorageSync(key, value)
}

export function removeStorage(key: string) {
  try {
    Taro.removeStorageSync(key)
  } catch {
    // ignore
  }
}

export function getStorageJson<T>(key: string): T | null {
  try {
    const v = Taro.getStorageSync(key)
    if (!v) return null
    if (typeof v === 'string') return JSON.parse(v) as T
    return v as T
  } catch {
    return null
  }
}

export function setStorageJson(key: string, value: unknown) {
  // Store as string for better cross-platform consistency.
  Taro.setStorageSync(key, JSON.stringify(value))
}

