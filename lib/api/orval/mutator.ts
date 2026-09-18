import type { AxiosError, AxiosRequestConfig } from 'axios'
import { api } from '@/lib/api'

export const customInstance = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const normalizedUrl =
    typeof config.url === 'string' ? config.url.replace(/^\/api(?=\/|$)/, '') : config.url

  const response = await api({
    ...config,
    ...options,
    url: normalizedUrl,
    headers: {
      ...(config.headers as Record<string, string> | undefined),
      ...(options?.headers as Record<string, string> | undefined),
    },
  })

  return response.data as T
}

export type ErrorType<Error> = AxiosError<Error>
export type BodyType<BodyData> = BodyData
