import { Router } from 'express'
import { celebrate, Joi } from 'celebrate'
import { getOne, generateNewDocRef, createMultiple } from '../db'
import { createFeedbackEvent, eventToNotification } from '../lib/logging'
import { swcAuthenticatedMiddleware } from '../lib/swc'
import { POSITIVE, NEUTRAL, NEGATIVE } from '../lib/constants'

export default () => {
  let api = Router()
  
  api.post('/', swcAuthenticatedMiddleware, celebrate({
    body: Joi.object().keys({
      rating: Joi.string().valid(POSITIVE).valid(NEUTRAL).valid(NEGATIVE),
      comment: Joi.string().required().allow('').allow(null),
      missionId: Joi.string().required(),
    })
  }), async (req, res) => {
    const updateSet = {
      rating: req.body.rating,
      comment: req.body.comment,
      mission_id: req.body.missionId,
      reviewer_id: req.swcUid,
      created_by: req.swcUid,
    }
    const mission = await getOne({ collection: 'missions', id: req.body.missionId })
    const newEventRef = await generateNewDocRef('events')
    const event = await createFeedbackEvent(mission.title, [req.swcUid], req.swcUid)
    const newCommentRef = await generateNewDocRef('feedback')
    await createMultiple([
      { collection: 'feedback', updateSet, ref: newCommentRef },
      { collection: 'events', updateSet: event, ref: newEventRef}
    ])
    req.io.emit('broadcast', JSON.stringify(eventToNotification({...event, uid: newEventRef.id})))
    const comment = await getOne({ collection: 'feedback', id: newEventRef.id })
    res.status(201).send(comment)
  })

	return api
}
