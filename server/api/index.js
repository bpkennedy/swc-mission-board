import { Router } from 'express'
import usersApi from './users-api'
import loginApi from './login-api'
import missionTypesApi from './mission-types-api'
import boardsApi from './boards-api'
import missionsApi from './missions-api'
import tasksApi from './tasks-api'

export const createApiRoutes = () => {
	let api = Router()
	api.use('/users', usersApi())
	api.use('/login', loginApi())
	api.use('/missions', missionsApi())
	api.use('/mission-types', missionTypesApi())
	api.use('/boards', boardsApi())
	api.use('/tasks', tasksApi())
	return api
}