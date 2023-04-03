let BASE_URL = ''
if (import.meta.env.PROD) {
  BASE_URL = 'http://cc.prod:8000'
} else {
  BASE_URL = 'http://why.dev:8000'
}
export const TIMEOUT = 10000
export { BASE_URL }
