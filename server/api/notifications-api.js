import { Router } from 'express'
import { query } from '../db'
import { swcAuthenticatedMiddleware } from '../lib/swc'

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
    const trimmedNotifications = myEvents.map(e => ({
      type: e.type,
      created_at: e.created_at.toDate().toLocaleString(),
      message: e.message,
    }))
    res.status(200).send(trimmedNotifications)
  })

	return api
}
