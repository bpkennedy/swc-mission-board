import { Router } from 'express'
import usersApi from './users-api'

export const createApiRoutes = () => {
	let api = Router()
	api.use('/users', usersApi())
	return api
}