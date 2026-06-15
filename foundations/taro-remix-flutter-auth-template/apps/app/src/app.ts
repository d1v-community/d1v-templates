import { PropsWithChildren } from 'react'
import Taro, { useLaunch } from '@tarojs/taro'

import './app.less'

if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
  require('./app.weapp.less')
}

let h5ChunkRecoveryInstalled = false
function installH5ChunkRecoveryOnce() {
  if (h5ChunkRecoveryInstalled) return
  h5ChunkRecoveryInstalled = true

  if (Taro.getEnv() !== Taro.ENV_TYPE.WEB) return
  if (typeof window === 'undefined') return

  const shouldHandle = (err: any) => {
    const msg = String(err?.message || err || '')
    return (
      msg.includes('ChunkLoadError') ||
      msg.includes('Loading chunk') ||
      msg.includes('CSS_CHUNK_LOAD_FAILED') ||
      msg.includes('JS_CHUNK_LOAD_FAILED')
    )
  }

  const promptReload = async () => {
    // Avoid infinite reload loops if the server is genuinely misconfigured.
    const key = '__yzh_chunk_reload_once__'
    const already = window.sessionStorage?.getItem?.(key) === '1'
    if (!already) window.sessionStorage?.setItem?.(key, '1')

    try {
      const res = await Taro.showModal({
        title: '页面已更新',
        content: already ? '资源加载失败，请刷新或稍后重试。' : '检测到新版本资源，刷新后继续使用。',
        confirmText: '刷新',
        cancelText: '稍后',
      })
      if (res.confirm) {
        // Add a cache-busting query to improve reliability in WebView caches.
        const url = window.location.href.split('#')[0].split('?')[0]
        window.location.replace(`${url}?r=${Date.now()}`)
      }
    } catch {
      // Fallback: if modal fails, force a reload once.
      if (!already) {
        const url = window.location.href.split('#')[0].split('?')[0]
        window.location.replace(`${url}?r=${Date.now()}`)
      }
    }
  }

  window.addEventListener('unhandledrejection', (evt: PromiseRejectionEvent) => {
    if (!shouldHandle((evt as any).reason)) return
    evt.preventDefault?.()
    void promptReload()
  })

  window.addEventListener('error', (evt: ErrorEvent) => {
    if (!shouldHandle(evt.error || evt.message)) return
    evt.preventDefault?.()
    void promptReload()
  })
}

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
    installH5ChunkRecoveryOnce()
  })

  // children 是将要会渲染的页面
  return children
}
  


export default App
