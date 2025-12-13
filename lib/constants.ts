
export const defaultSamplesPageSize = 6;

export const defaultCartPageSize = 8;

let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()\-_=+]).{8,}$/;

if (process.env.NODE_ENV === 'development') {
  passwordRegex = /^.{8,}$/;
}

export { passwordRegex };

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
