import { Router } from 'express'
import usersApi from './users-api'
import loginApi from './login-api'

export const createApiRoutes = () => {
	let api = Router()
	api.use('/users', usersApi())
	api.use('/login', loginApi())
	return api
}