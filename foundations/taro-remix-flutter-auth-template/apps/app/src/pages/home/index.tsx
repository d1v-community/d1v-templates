import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { authMe } from '../../services/auth'
import { STORAGE_KEYS } from '../../storage/keys'
import { removeStorage } from '../../storage/storage'
import './index.less'

type UserState = {
  email: string | null
  displayName: string | null
}

export default function HomePage() {
  const [user, setUser] = useState<UserState | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await authMe()
        if ('authenticated' in res && res.authenticated) {
          setUser({
            email: res.user.email,
            displayName: res.user.displayName,
          })
          return
        }
      } catch {
        // ignore and redirect below
      }

      removeStorage(STORAGE_KEYS.authToken)
      Taro.redirectTo({ url: '/pages/login/index' })
    }

    void load()
  }, [])

  return (
    <View className='page'>
      <View className='card'>
        <Text className='eyebrow'>Authenticated</Text>
        <Text className='title'>{user?.displayName || user?.email || 'Signed in'}</Text>
        <Text className='desc'>This page proves the Taro client can reuse the same Remix auth backend.</Text>
        <Button
          className='button'
          onClick={() => {
            removeStorage(STORAGE_KEYS.authToken)
            Taro.redirectTo({ url: '/pages/login/index' })
          }}
        >
          Sign out locally
        </Button>
      </View>
    </View>
  )
}
