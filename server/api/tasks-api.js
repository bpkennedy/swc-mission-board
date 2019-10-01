import { Promise } from 'es6-promise'
import pLimit from 'p-limit'
import { Router } from 'express'
import { getOne, getAll, createOne, updateOne } from '../db'
import {
  swcAuthenticatedMiddleware,
  getGalaxySectorsFromCombine,
  getGalaxySystemsFromCombine,
} from '../lib/swc'
import { celebrate, Joi } from 'celebrate'

const refreshSectorsAndSystems = async () => {
  const existingSectors = await getAll({ collection: 'sectors' })
  const existingSystems = await getAll({ collection: 'systems' })
  const newSectors = await getGalaxySectorsFromCombine()
  const newSystems = await getGalaxySystemsFromCombine()
  await upsertResources('sectors', existingSectors, newSectors)
  await upsertResources('systems', existingSystems, newSystems)
}

const upsertResources = async (collection, existingItems, newItems) => {
  const updates = []
  const inserts = []
  const promiseLimit = pLimit(20)
  for (let item of newItems) {
    const existingItem = existingItems.find(i => i.uid === item.uid)
    if (existingItem) {
      const updateResource = updateOne({ collection, id: item.uid, updateSet: item })
      updates.push(promiseLimit(() => updateResource))
    } else {
      const insertResource = createOne({ collection, id: item.uid, updateSet: item })
      inserts.push(promiseLimit(() => insertResource))
    }
  }
  await Promise.all(updates)
  await Promise.all(inserts)
}

export default () => {
  let api = Router()
  
  api.post('/', swcAuthenticatedMiddleware, celebrate({
    body: {
      task: Joi.string().required(),
    }
  }), async (req, res, next) => {
    const appUser = await getOne({ collection: 'users', id: req.swcUid})
    if (appUser.admin) {
      if (req.body.task === 'update-systems') {
        await refreshSectorsAndSystems()
        res.status(200).send({ message: 'Update Systems Complete' })
        return next()
      }
      return next('Not found')
    } else {
      return next('Forbidden')
    }
  })

	return api
}
