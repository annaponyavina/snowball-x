import { BCS_BASE_URL, BCS_REFRESH_TOKEN } from '@/shared/config/env'
import type { BcsTokenResponse } from './types'

const TOKEN_URL = `${BCS_BASE_URL}/trade-api-keycloak/realms/tradeapi/protocol/openid-connect/token`

/** Кэш access-токена в памяти. */
let cached: { accessToken: string; expiresAt: number } | null = null
/** Актуальный refresh-токен (обновляется при ротации). */
let refreshToken = BCS_REFRESH_TOKEN

/** Обменять refresh-токен на access-токен. */
async function refresh(): Promise<string> {
  if (!refreshToken) {
    throw new Error('BCS: не задан VITE_BCS_REFRESH_TOKEN')
  }

  const body = new URLSearchParams({
    client_id: 'trade-api-read',
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  })

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body,
  })

  if (!res.ok) {
    throw new Error(`BCS: авторизация не удалась (${res.status})`)
  }

  const data = (await res.json()) as BcsTokenResponse
  // Keycloak ротирует refresh-токен — сохраняем новый для следующих обновлений.
  if (data.refresh_token) refreshToken = data.refresh_token
  // Обновляем за 60 с до истечения, чтобы не поймать протухший токен.
  cached = {
    accessToken: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  }
  return cached.accessToken
}

/** Получить действующий access-токен (из кэша либо обновив). */
export async function getAccessToken(): Promise<string> {
  if (cached && Date.now() < cached.expiresAt) return cached.accessToken
  return refresh()
}
