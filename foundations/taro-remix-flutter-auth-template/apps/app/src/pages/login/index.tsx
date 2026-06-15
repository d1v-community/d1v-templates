import { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input, Button } from '@tarojs/components'
import { authSendCode, authVerifyLogin } from '../../services/auth'
import { STORAGE_KEYS } from '../../storage/keys'
import { setStorageString } from '../../storage/storage'
import './index.less'

function isEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function LoginPage() {
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [devCode, setDevCode] = useState('')
  const [busy, setBusy] = useState(false)

  const sendCode = async () => {
    const value = email.trim()
    if (!isEmail(value) || busy) return

    setBusy(true)
    try {
      const res = await authSendCode(value)
      if (!res.success) throw new Error(res.error || 'Failed to send code')
      setDevCode(res.code || '')
      setStep('code')
      Taro.showToast({ title: 'Code sent', icon: 'none' })
    } catch (error) {
      Taro.showToast({ title: error instanceof Error ? error.message : 'Send failed', icon: 'none' })
    } finally {
      setBusy(false)
    }
  }

  const verify = async () => {
    if (code.trim().length !== 6 || busy) return

    setBusy(true)
    try {
      const res = await authVerifyLogin(email.trim(), code.trim())
      if (!res.success || !res.token) throw new Error(res.error || 'Login failed')
      setStorageString(STORAGE_KEYS.authToken, res.token)
      Taro.redirectTo({ url: '/pages/home/index' })
    } catch (error) {
      Taro.showToast({ title: error instanceof Error ? error.message : 'Login failed', icon: 'none' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <View className='page'>
      <View className='card'>
        <Text className='eyebrow'>Taro Client</Text>
        <Text className='title'>Email auth</Text>
        <Text className='desc'>Shared `/api/auth/*` flow for H5 and mini-program builds.</Text>

        <View className='field'>
          <Text className='label'>Email</Text>
          <Input
            className='input'
            type='text'
            value={email}
            onInput={(event) => setEmail(event.detail.value)}
            placeholder='name@example.com'
            disabled={busy || step === 'code'}
          />
        </View>

        {step === 'code' ? (
          <View className='field'>
            <Text className='label'>Code</Text>
            <Input
              className='input'
              type='number'
              value={code}
              maxlength={6}
              onInput={(event) => setCode(event.detail.value.replace(/\D/g, '').slice(0, 6))}
              placeholder='6 digits'
              disabled={busy}
            />
            {devCode ? <Text className='hint'>Dev code: {devCode}</Text> : null}
          </View>
        ) : null}

        {step === 'email' ? (
          <Button className='button' disabled={!isEmail(email.trim()) || busy} onClick={() => void sendCode()}>
            {busy ? 'Sending...' : 'Send code'}
          </Button>
        ) : (
          <View className='actions'>
            <Button className='button' disabled={code.trim().length !== 6 || busy} onClick={() => void verify()}>
              {busy ? 'Signing in...' : 'Sign in'}
            </Button>
            <Button
              className='button secondary'
              disabled={busy}
              onClick={() => {
                setStep('email')
                setCode('')
                setDevCode('')
              }}
            >
              Edit email
            </Button>
          </View>
        )}
      </View>
    </View>
  )
}
