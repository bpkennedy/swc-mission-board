import { Router } from 'express'
import { getAll, getOne, query } from '../db'
import { swcAuthenticatedMiddleware } from '../lib/swc'

export default () => {
  let api = Router()
  
	api.get('/', swcAuthenticatedMiddleware, async (req, res) => {
    res.status(200).send(await getAll({ collection: 'missions' }))
  })
  
  api.get('/public', swcAuthenticatedMiddleware, async (req, res) => {
    const availablePublicMissionsQuery = [{
      field: 'status',
      comparison: '==',
      value: 'Available'
    }, {
      field: 'board_ids',
      comparison: 'array-contains',
      value: 'public'
    }]
    res.status(200).send(await query({
      collection: 'missions',
      querySets: availablePublicMissionsQuery
    }))
  })
  
  api.get('/:id', swcAuthenticatedMiddleware, async (req, res) => {
    const mission = await getOne({ collection: 'missions', id: req.params.id })
    if (mission) {
      res.status(200).send(mission)
    } else {
      res.status(404).send('Not found.')
    }
  })

	return api
}
