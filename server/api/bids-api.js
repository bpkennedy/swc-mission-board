import { Router } from 'express'
import { getAll, query, getOne, updateOrCreateMultiple, createMultiple, generateNewDocRef } from '../db'
import { createBidEvent, acceptBidEvent } from '../lib/logging'
import { swcAuthenticatedMiddleware } from '../lib/swc'
import { celebrate, Joi } from 'celebrate'
import {
  ACTIVE_KEY,
  PENDING_KEY,
  CLOSED_KEY,
} from '../lib/constants'

const acceptBid = async (mission, bid, acceptingBidderId, currentUserUid) => {
  const updateRefSetArray = []
  const targetUserUids = []
  // update mission with contractorId
  const updateMissionSet = {
    contractor_id: bid.bidder_id,
    status: PENDING_KEY,
  }
  updateRefSetArray.push({collection: 'missions', id: mission.uid, updateSet: updateMissionSet})

  // update winning bid for missionId with active
  const allBidsForMissionQuery = [{
    field: 'mission_id',
    comparison: '==',
    value: mission.uid
  }]
  const missionBids = await query({
    collection: 'bids',
    querySets: allBidsForMissionQuery
  })

  // update mission bids with Active or Closed
  for (const missionBid of missionBids) {
    if (missionBid.uid === acceptingBidderId) {
      const winningBidUpdateSet = { status: ACTIVE_KEY }
      updateRefSetArray.push({collection: 'bids', id: missionBid.uid, updateSet: winningBidUpdateSet})
    } else {
      const losingBidUpdateSet = { status: CLOSED_KEY }
      updateRefSetArray.push({collection: 'bids', id: missionBid.uid, updateSet: losingBidUpdateSet})
    }
    targetUserUids.push(missionBid.bidder_id)
  }
  
  targetUserUids.push(mission.created_by)
  const event = await acceptBidEvent(mission, targetUserUids, bid, currentUserUid)
  await updateOrCreateMultiple({
    updateRefSetArray,
    createRefSetArray: [{ collection: 'events', updateSet: event }]
  })
}

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
    const mission = await getOne({ collection: 'missions', id: req.body.missionId })
    const event = await createBidEvent(mission, [req.swcUid, mission.created_by], req.swcUid)
    const newBidRef = await generateNewDocRef('bids')
    await createMultiple([
      { collection: 'bids', updateSet, ref: newBidRef },
      { collection: 'events', updateSet: event, }
    ])
    const newBid = await getOne({ collection: 'bids', id: newBidRef.id })
    res.status(201).send(newBid)
  })
  
  api.post('/:bidId/accept', swcAuthenticatedMiddleware, celebrate({
    body: Joi.object().keys({
      bidderId: Joi.string().required(),
      missionId: Joi.string().required(),
    })
  }), async (req, res) => {
    const mission = await getOne({ collection: 'missions', id: req.body.missionId})
    const bid = await getOne({ collection: 'bids', id: req.params.bidId})
    await acceptBid(mission, bid, req.body.bidderId, req.swcUid)
    res.status(200).send()
  })

	return api
}
