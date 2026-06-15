import { useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { STORAGE_KEYS } from '../../storage/keys'
import { getStorageString, removeStorage } from '../../storage/storage'
import { authMe } from '../../services/auth'
import './index.less'

export default function IndexPage() {
  useEffect(() => {
    const bootstrap = async () => {
      const token = getStorageString(STORAGE_KEYS.authToken)
      if (!token) {
        Taro.redirectTo({ url: '/pages/login/index' })
        return
      }

      try {
        const me = await authMe()
        if ('authenticated' in me && me.authenticated) {
          Taro.redirectTo({ url: '/pages/home/index' })
          return
        }
      } catch {
        // ignore and fall through
      }

      removeStorage(STORAGE_KEYS.authToken)
      Taro.redirectTo({ url: '/pages/login/index' })
    }

    void bootstrap()
  }, [])

  return (
    <View className='page'>
      <Text className='title'>Bootstrapping session...</Text>
    </View>
  )
}
