import { Router } from 'express'
import { query, updateMultiple } from '../db'
import { swcAuthenticatedMiddleware } from '../lib/swc'
import { eventToNotification } from '../lib/logging'
import { celebrate, Joi } from 'celebrate'
import { FieldValue } from '@google-cloud/firestore'

export default () => {
  let api = Router()
  
	api.get('/me', swcAuthenticatedMiddleware, async (req, res) => {
    const currentUserNotificationsQuery = [{
      field: 'target_user_uids',
      comparison: 'array-contains',
      value: req.swcUid,
    }]
    const myEvents = await query({
      collection: 'events',
      querySets: currentUserNotificationsQuery
    })
    const trimmedNotifications = myEvents.map(e => eventToNotification(e))
    res.status(200).send(trimmedNotifications)
  })
  
  api.put('/mark-read', swcAuthenticatedMiddleware, celebrate({
    body: Joi.object().keys({
      notificationIds: Joi.array().items(Joi.string()).required(),
      readerUid: Joi.string().required(),
    })
  }), async (req, res) => {
    const updateRefSetArray = []
    for (const id of req.body.notificationIds) {
      updateRefSetArray.push({
        collection: 'events',
        id,
        updateSet: { target_user_read: FieldValue.arrayUnion(req.body.readerUid) },
      })
    }
    await updateMultiple(updateRefSetArray)
    res.status(200).send()
  })

	return api
}
