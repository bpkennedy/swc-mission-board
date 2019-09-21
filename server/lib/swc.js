import axios from 'axios'
import qs from 'qs'
const oauth_url = 'http://www.swcombine.com/ws/oauth2/token/'
const character_url = 'http://www.swcombine.com/ws/v1.0/character/'
const client_id = process.env.SWCOMBINE_CLIENT_ID
const client_secret = process.env.SWCOMBINE_CLIENT_SECRET
const redirect_uri = process.env.SWCOMBINE_REDIRECT_URI

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
    return axios(request)
  } catch(response) {
    throw response.response.data.error
  }
}

export const getSwcUserInfo = async (uid, accessToken) => {
	return axios.get(character_url + uid + '/', {
		params: {
			'access_token': accessToken,
		},
		headers: {
			'Accept': 'application/json'
		}
	})
}

async function getSwcUserUid(accessToken) {
  return axios.get(character_url, {
    params: {
      'access_token': accessToken,
    },
    headers: {
      'Accept': 'application/json'
    },
  })
}

export const swcAuthenticatedMiddleware = async (req, res, next) => {
  try {
    const { data } = await getSwcUserUid(req.get('x-swcmb-access-token'))
    if (data) {
      req.swcUid = data.character.uid
      req.swcToken = req.get('x-swcmb-access-token')
    }
    next()
  } catch (error) {
    if (error.response.status === 401) {
      res.status(401).send(error.response.data)
    }
    next(error)
  }
}

