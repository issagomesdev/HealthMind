const APP_ENV = process.env.EXPO_PUBLIC_APP_ENV ?? 'development'
const API_URL_DEV = process.env.EXPO_PUBLIC_API_URL_DEV ?? ''
const API_URL_PROD = process.env.EXPO_PUBLIC_API_URL_PROD ?? ''

if (__DEV__ && !API_URL_DEV) {
  console.warn('[env] EXPO_PUBLIC_API_URL_DEV não definida no .env')
}

const API_BASE_URL = APP_ENV === 'production' ? API_URL_PROD : API_URL_DEV

export const env = {
  APP_ENV,
  API_BASE_URL,
  isDev: APP_ENV === 'development',
  isProd: APP_ENV === 'production',
} as const
