import { Router } from 'express'
import { getAll, createOne } from '../db'
import { swcAuthenticatedMiddleware } from '../lib/swc'
import { celebrate, Joi } from 'celebrate'

export default () => {
  let api = Router()

	api.get('/', swcAuthenticatedMiddleware, async (req, res) => {
    res.status(200).send(await getAll({ collection: 'bids' }))
  })

  api.post('/', swcAuthenticatedMiddleware, celebrate({
    body: Joi.object().keys({
      bidderId: Joi.string().required(),
      missionId: Joi.string().required(),
    })
  }), async (req, res) => {
    const updateSet = {
      bidder_id: req.body.bidderId,
      mission_id: req.body.missionId,
      created_by: req.swcUid,
    }
    const newBid = await createOne({ collection: 'bids', updateSet })
    res.status(201).send(newBid)
  })

	return api
}
