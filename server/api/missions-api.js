import { Router } from 'express'
import { getAll, getOne, query, createOne } from '../db'
import { swcAuthenticatedMiddleware } from '../lib/swc'
import { celebrate, Joi } from 'celebrate'

export default () => {
  let api = Router()
  
	api.get('/', swcAuthenticatedMiddleware, async (req, res) => {
    res.status(200).send(await getAll({ collection: 'missions' }))
  })
  
  api.post('/', swcAuthenticatedMiddleware, celebrate({
    body: Joi.object().keys({
      autoAccept: Joi.boolean().required(),
      anonymous: Joi.boolean().required(),
      missionType: Joi.string().required(),
      startByDate: Joi.string().allow('').optional(),
      completeByDate: Joi.string().allow('').optional(),
      description: Joi.string().allow('').optional(),
      title: Joi.string().required(),
      audience: Joi.array().items(Joi.string().required()),
      originBoard: Joi.string().required().allow(null),
      startingSector: Joi.string().allow('').optional(),
      startingSystem: Joi.string().allow('').optional(),
      endingSector: Joi.string().allow('').optional(),
      endingSystem: Joi.string().allow('').optional(),
    })
  }), async (req, res) => {
    const updateSet = {
      auto_accept: req.body.autoAccept,
      anonymous: req.body.anonymous,
      mission_type_id: req.body.missionType,
      start_by_date: req.body.startByDate,
      complete_by_date: req.body.completeByDate,
      description: req.body.description,
      title: req.body.title,
      board_ids: req.body.audience,
      origin_board_id: req.body.originBoard,
      starting_sector: req.body.startingSector,
      starting_system: req.body.startingSystem,
      ending_sector: req.body.endingSector,
      ending_system: req.body.endingSystem,
      status: 'Available',
      created_by: req.swcUid,
    }
    const newMission = await createOne({ collection: 'missions', updateSet })
    res.status(201).send(newMission)
  })
  
  api.get('/public', swcAuthenticatedMiddleware, async (req, res) => {
    const availablePublicMissionsQuery = [{
      field: 'status',
      comparison: '==',
      value: 'Available'
    }, {
      field: 'board_ids',
      comparison: 'array-contains',
      value: 'public'
    }]
    res.status(200).send(await query({
      collection: 'missions',
      querySets: availablePublicMissionsQuery
    }))
  })
  
  api.get('/board/:id', swcAuthenticatedMiddleware, async (req, res) => {
    const appUser = await getOne({ collection: 'users', id: req.swcUid})
    if (appUser.board_ids.includes(req.params.id)) {
      const BoardMissionsQuery = [{
        field: 'board_ids',
        comparison: 'array-contains',
        value: req.params.id
      }]
      res.status(200).send(await query({
        collection: 'missions',
        querySets: BoardMissionsQuery
      }))
    } else {
      res.status(403).send({ message: 'Forbidden' })
    }
  })
  
  api.get('/:id', swcAuthenticatedMiddleware, async (req, res) => {
    const mission = await getOne({ collection: 'missions', id: req.params.id })
    if (mission) {
      res.status(200).send(mission)
    } else {
      res.status(404).send('Not found.')
    }
  })

	return api
}
