import { axiosInstance } from './axios'

const hostUrl = window.location.protocol + '//' + window.location.host + '/'

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
  window.location.href = hostUrl + 'authorize/index.html'
}

async function testIsValidToken(expiresAt) {
  if (new Date() > new Date(expiresAt)) {
    return false
  }
  return true
}

async function refreshTokens(oldAccessToken) {
  const { access_token, expires_at } = await axiosInstance.get(hostUrl + 'api/v1/login/refresh', {
    headers: {
      'x-swcmb-access-token': oldAccessToken,
    }
  })
  clearTokens()
  setNewTokens(access_token, expires_at)
}

function setAxiosInterceptors() {
  axiosInstance.interceptors.request.use(config => {
    config.headers['x-swcmb-access-token'] = window.localStorage.getItem('swcAccessToken')
    return config
  }, error => Promise.reject(error))

  axiosInstance.interceptors.response.use(async response => response, async error => {
    if (error.status === 401) {
      const accessToken = window.localStorage.getItem('swcAccessToken')
      if (!accessToken) {
        redirectToOauthLogin()
      } else {
        await refreshTokens(accessToken)
        axiosInstance.request(error.config)
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
