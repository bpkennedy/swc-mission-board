import { Router } from 'express'
import { getAll, systems } from '../db'
import { swcAuthenticatedMiddleware } from '../lib/swc'

export default () => {
  let api = Router()
	api.get('/', swcAuthenticatedMiddleware, async (req, res) => {
    const sectors = await getAll({ collection: 'sectors' })
    const hydratedSectors = sectors.map(sector => {
      sector.systems = sector.systems.map(systemUid => {
        return systems.find(sys => sys.uid === systemUid)
      })
      return sector
    })
    res.status(200).send(hydratedSectors)
  })

	return api
}
