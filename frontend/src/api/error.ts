import { isAxiosError } from "axios"

type ApiErrorResponse = {
  message?: string
}

export function getApiErrorMessage(error: unknown, fallbackMessage: string): string {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message || error.message || fallbackMessage
  }

  if (error instanceof Error) {
    return error.message || fallbackMessage
  }

  return fallbackMessage
}
