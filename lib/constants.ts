/** Number of samples displayed per page on the store listing. */
export const defaultSamplesPageSize = 6

/** Number of cart items displayed per page inside the cart drawer. */
export const defaultCartPageSize = 8

let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()\-_=+]).{8,}$/

if (process.env.NODE_ENV === 'development') {
  passwordRegex = /^.{8,}$/
}

/**
 * Regex that validates user passwords.
 * In production requires at least 8 characters with uppercase, lowercase, digit,
 * and special character. In development any string of 8+ characters passes.
 */
export { passwordRegex }

/** Basic email format validator — checks for the `local@domain.tld` shape. */
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
