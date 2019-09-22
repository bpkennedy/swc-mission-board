import { axiosInstance } from './axios'

const hostUrl = window.location.protocol + '//' + window.location.host + '/'
let globalAuthRetries = 0

function clearTokens() {
  window.localStorage.removeItem('swcAccessToken')
  window.localStorage.removeItem('swcAuthorizationCode')
  window.localStorage.removeItem('swcExpiresAt')
}

function setNewTokens(access, expiresAt) {
  if (access && expiresAt) {
    window.localStorage.setItem('swcAccessToken', access)
    window.localStorage.setItem('swcExpiresAt', expiresAt)
  }
}

function redirectToOauthLogin() {
  clearTokens()
  window.location.href = hostUrl + 'statics/authorize/index.html'
}

async function testIsValidToken(expiresAt) {
  if (new Date() > new Date(expiresAt)) {
    return false
  }
  return true
}

async function refreshTokens(oldAccessToken) {
  const { data: { access_token, expires_at } } = await axiosInstance.get(hostUrl + 'api/v1/login/refresh', {
    headers: {
      'x-swcmb-access-token': oldAccessToken,
    }
  })
  if (access_token && expires_at) {
    clearTokens()
    setNewTokens(access_token, expires_at)
  }
}

function setAxiosInterceptors() {
  axiosInstance.interceptors.request.use(config => {
    config.headers['x-swcmb-access-token'] = window.localStorage.getItem('swcAccessToken')
    return config
  }, error => Promise.reject(error))

  axiosInstance.interceptors.response.use(async response => response, async error => {
    if (error.status === '401' || (error.message && error.message.indexOf('401') > -1)) {
      console.log('INTCP: API responded with a 401 type error, trying to recover...')
      globalAuthRetries += 1
      if (globalAuthRetries === 3) {
        return Promise.reject(error)
      }
      const accessToken = window.localStorage.getItem('swcAccessToken')
      if (!accessToken) {
        console.log('INTCP: no swc access tokens found, so redirecting to login...')
        redirectToOauthLogin()
      } else {
        console.log('INTCP: swc access token found and presumed old, so refreshing tokens...')
        await refreshTokens(accessToken)
        console.log('INTCP: swc tokens have been refreshed, so retrying the original request...')
        const originalRequest = await axiosInstance.request(error.config)
        console.log('INTCP: original request succeeded and data is: ')
        console.log(originalRequest)
        globalAuthRetries = 0
      }
    }
    return Promise.reject(error)
  })
}

export default async ({ Vue }) => {
  const accessToken = window.localStorage.getItem('swcAccessToken')
  if (!accessToken) {
    redirectToOauthLogin()
  } else {
    const expiresAt = window.localStorage.getItem('swcExpiresAt')
    const isValid = await testIsValidToken(expiresAt)
    if (!isValid) {
      try {
        await refreshTokens(accessToken)
      } catch (error) {
        if (error.response.data === 'invalid_grant') {
          redirectToOauthLogin()
        }
      }
    }
  }
  setAxiosInterceptors()
}
