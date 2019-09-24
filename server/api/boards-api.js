import { Router } from 'express'
import { getAll, getOne } from '../db'
import { swcAuthenticatedMiddleware } from '../lib/swc'

export default () => {
  let api = Router()
  
	api.get('/', swcAuthenticatedMiddleware, async (req, res) => {
    res.status(200).send(await getAll({ collection: 'boards' }))
  })
  
  api.get('/:id', swcAuthenticatedMiddleware, async (req, res) => {
    const board = await getOne({ collection: 'boards', id: req.params.id })
    if (board) {
      res.status(200).send(board)
    } else {
      res.status(404).send('Not found.')
    }
  })

	return api
}
