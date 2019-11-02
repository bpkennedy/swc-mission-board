import { Router } from 'express'
import { getAll, getOne, createOne } from '../db'
import { swcAuthenticatedMiddleware, getSwcUserInfo } from '../lib/swc'

async function createUserProfile(id, token) {
	const { data: { character } } = await getSwcUserInfo(id, token)
	const updateSet = {
		handle: character.name,
		image: character.image,
		race: character.race,
		gender: character.gender
	}
	return createOne({ collection: 'users', updateSet, id })
}

export async function userHandle(userUid) {
	const player = await getOne({ collection: 'users', id: userUid })
	return player.handle
}

export default () => {
	let api = Router()

	api.get('/', swcAuthenticatedMiddleware, async (req, res) => {
    res.status(200).send(await getAll({collection: 'users'}))
	})
	
	api.get('/me', swcAuthenticatedMiddleware, async (req, res) => {
		let user = await getOne({id: req.swcUid, collection: 'users'})
		if (!user) {
			user = await createUserProfile(req.swcUid, req.swcToken)
		}
		res.status(200).send(user)
	})
	
	api.get('/:id', swcAuthenticatedMiddleware, async (req, res) => {
		const user = await getOne({id: req.params.id, collection: 'users'})
		if (user) {
			res.status(200).send(user)
		} else {
			res.status(404).send('Not found.')
		}
	})

	return api
}
