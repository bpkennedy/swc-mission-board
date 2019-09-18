import { Router } from 'express'
import { createOne } from '../db'
import { getAccessToken } from '../lib/swc'

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
      updateSet: { access_token, refresh_token, expires_at }
    })
    res.status(200).send({ access_token, expires_at })
	})

	return api
}
