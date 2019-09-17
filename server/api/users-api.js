import { Router } from 'express'
import { getAll, getOne } from '../db'

export default () => {
	let api = Router()

	api.get('/', async (req, res) => {
		const users = await getAll({collection: 'users'})
    res.status(200).send(users)
	})
	
	api.get('/:id', async (req, res) => {
		const user = await getOne({id: req.params.id, collection: 'users'})
		if (user) {
			res.status(200).send(user)
		} else {
			res.status(404).send('Not found.')
		}
	})

	return api
}
