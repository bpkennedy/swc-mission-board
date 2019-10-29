import { Router } from 'express'
import usersApi from './users-api'
import loginApi from './login-api'
import missionTypesApi from './mission-types-api'
import boardsApi from './boards-api'
import missionsApi from './missions-api'
import bidsApi from './bids-api'
import tasksApi from './tasks-api'
import sectorsApi from './sectors-api'

export const createApiRoutes = () => {
	let api = Router()
	api.use('/users', usersApi())
	api.use('/login', loginApi())
	api.use('/missions', missionsApi())
	api.use('/bids', bidsApi())
	api.use('/mission-types', missionTypesApi())
	api.use('/boards', boardsApi())
	api.use('/tasks', tasksApi())
	api.use('/sectors', sectorsApi())
	return api
}