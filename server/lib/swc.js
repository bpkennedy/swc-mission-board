import axios from 'axios'
import qs from 'qs'
const oauth_url = 'http://www.swcombine.com/ws/oauth2/token/'
const client_id = process.env.SWCOMBINE_CLIENT_ID
const client_secret = process.env.SWCOMBINE_CLIENT_SECRET
const redirect_uri = process.env.SWCOMBINE_REDIRECT_URI

export const getPlayerUid = async (token) => {
  return axios.get(`http://www.swcombine.com/ws/v1.0/character/?access_token=${token}`, {
    headers: { 'Accept': 'application/json' }
  })
}

export const refreshAccessToken = async (refresh_token) => {
  const request = {
    url: oauth_url,
    method: 'POST',
    data: qs.stringify({
      grant_type: 'refresh_token',
      refresh_token,
      client_id,
      client_secret,
    }),
    headers: {
      'Accept': 'application/json'
    }
  }
  return axios(request)
}

export const getAccessToken = async (code) => {
  const request = {
    url: oauth_url,
    method: 'POST',
    data: qs.stringify({
      code,
      client_id,
      client_secret,
      grant_type: 'authorization_code',
      redirect_uri,
      access_type: 'offline'
    }),
    headers: {
      'Accept': 'application/json'
    }
  }
  try {
    const response = await axios(request)
    return response
  } catch(response) {
    const errorMessage = response.response.data.error
    throw errorMessage
  }
}
