import { Router } from 'express'
import { createOne, getOne } from '../db'
import { getAccessToken, refreshAccessToken } from '../lib/swc'

function dateWithAddedMinutes(expires_in) {
  const minutes = (expires_in - 120) / 60
  return new Date(new Date().getTime() + (minutes * 60000))
}

export default () => {
  let api = Router()
  
	api.get('/', async (req, res) => {
    const {
      data: { access_token, refresh_token, expires_in }
    } = await getAccessToken(req.query.authorization_code)
    const expires_at = dateWithAddedMinutes(expires_in)
    await createOne({
      collection: 'tokens',
      updateSet: { access_token, refresh_token, expires_at },
      id: access_token,
    })
    res.status(200).send({ access_token, expires_at })
  })
  
  api.get('/refresh', async (req, res) => {
    const expiredAccessToken = req.get('x-swcmb-access-token')
    const { refresh_token } = await getOne({ collection: 'tokens', id: expiredAccessToken })
    const {
      data: { access_token, expires_in }
    } = await refreshAccessToken(refresh_token)
    const expires_at = dateWithAddedMinutes(expires_in)
    res.status(200).send({ access_token, expires_at })
  })

	return api
}
