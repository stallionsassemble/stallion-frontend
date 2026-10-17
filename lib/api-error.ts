/** Reads the message the API sent (a string or a list of validation messages), not axios' generic one. */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  const message = (error as { response?: { data?: { message?: unknown } } })?.response?.data?.message
  if (Array.isArray(message) && message.length > 0) return message.join('. ')
  if (typeof message === 'string' && message) return message
  if (error instanceof Error && error.message && !/status code \d+/.test(error.message)) return error.message
  return fallback
}
