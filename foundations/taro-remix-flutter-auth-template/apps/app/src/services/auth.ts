import { apiRequest } from './api'

export type AuthUser = {
  id: string
  username: string | null
  email: string | null
  displayName: string | null
  avatarUrl: string | null
  useTampon?: boolean | null
}

export type AuthMeResponse =
  | { authenticated: false }
  | { authenticated: true; user: AuthUser }

export async function authMe() {
  return apiRequest<AuthMeResponse>({ path: '/api/auth/me', method: 'GET' })
}

export async function authSendCode(email: string) {
  return apiRequest<{ success: boolean; message?: string; error?: string; dev?: boolean; code?: string }>({
    path: '/api/auth/send-code',
    method: 'POST',
    data: { email },
  })
}

export async function authVerifyLogin(email: string, code: string) {
  return apiRequest<{
    success: boolean
    error?: string
    token?: string
    user?: AuthUser
  }>({
    path: '/api/auth/verify-login',
    method: 'POST',
    data: { email, code },
  })
}
