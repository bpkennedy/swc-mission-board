import { Router } from 'express'
import { getAll, createOne, query, updateMultiple } from '../db'
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
  
  api.post('/:bidId/accept', swcAuthenticatedMiddleware, celebrate({
    body: Joi.object().keys({
      bidderId: Joi.string().required(),
      missionId: Joi.string().required(),
    })
  }), async (req, res) => {
    const updateMultipleRefSet = []
    // update mission with contractorId
    const updateMissionSet = {
      contractor_id: req.body.bidderId,
      status: 'Pending',
    }
    updateMultipleRefSet.push({collection: 'missions', id: req.body.missionId, updateSet: updateMissionSet})

    // update winning bid for missionId with active
    const allBidsForMissionQuery = [{
      field: 'mission_id',
      comparison: '==',
      value: req.body.missionId
    }]
    const missionBids = await query({
      collection: 'bids',
      querySets: allBidsForMissionQuery
    })

    // update mission bids with Active or Closed
    for (const bid of missionBids) {
      if (bid === req.params.bidId) {
        const winningBidUpdateSet = { status: 'Active' }
        updateMultipleRefSet.push({collection: 'bids', id: bid.uid, updateSet: winningBidUpdateSet})
      } else {
        const losingBidUpdateSet = { status: 'Closed' }
        updateMultipleRefSet.push({collection: 'bids', id: bid.uid, updateSet: losingBidUpdateSet})
      }
    }
    
    // try and updateMultiple in transaction
    await updateMultiple(updateMultipleRefSet)
    res.status(201).send({ test: 'done' })
  })

	return api
}
