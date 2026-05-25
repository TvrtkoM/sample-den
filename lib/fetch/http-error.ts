export class HttpError extends Error {
  readonly isRetryable: boolean

  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message)
    this.isRetryable = statusCode >= 500 || [408, 425, 429].includes(statusCode)
  }
}
