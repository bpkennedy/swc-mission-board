import { Router } from 'express'
import { getAll, getOne } from '../db'
import { swcAuthenticatedMiddleware } from '../lib/swc'

export default () => {
  let api = Router()
  
	api.get('/', swcAuthenticatedMiddleware, async (req, res) => {
    res.status(200).send(await getAll({ collection: 'mission_types' }))
  })
  
  api.get('/:id', swcAuthenticatedMiddleware, async (req, res) => {
    const type = await getOne({ collection: 'mission_types', id: req.params.id })
    if (type) {
      res.status(200).send(type)
    } else {
      res.status(404).send('Not found.')
    }
  })

	return api
}
