import { Router } from 'express'
import { getAll, getOne, query, createOne, systems } from '../db'
import { swcAuthenticatedMiddleware } from '../lib/swc'
import { celebrate, Joi } from 'celebrate'

function addMapCoordinatesToMission(mission) {
  const startingSystem = systems.find(s => s.uid === mission.starting_system)
  const endingSystem = systems.find(s => s.uid === mission.ending_system)
  return {
    ...mission,
    startingSystemName: startingSystem ? startingSystem.name : null,
    endingSystemName: endingSystem ? endingSystem.name : null,
    startingX: startingSystem ? startingSystem.x : null,
    startingY: startingSystem ? startingSystem.y : null,
    endingX: endingSystem ? endingSystem.x : null,
    endingY: endingSystem ? endingSystem.y : null,
  }
}

function hydratedSystemMissions (missions) {
  return missions.map(mission => {
    let hydratedMission = { ...mission }
    if (mission.starting_system) {
      hydratedMission = { ...hydratedMission, starting_system_name: systems.find(s => s.uid === mission.starting_system).name }
    }
    if (mission.ending_system) {
      hydratedMission = { ...hydratedMission, ending_system_name: systems.find(s => s.uid === mission.ending_system).name }
    }
    return hydratedMission
  })
}

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
      pay: Joi.number().allow(0).required(),
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
      pay: req.body.pay,
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
    const publicMissions = await query({
      collection: 'missions',
      querySets: availablePublicMissionsQuery
    })
    res.status(200).send(hydratedSystemMissions(publicMissions))
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
      res.status(200).send(addMapCoordinatesToMission(mission))
    } else {
      res.status(404).send('Not found.')
    }
  })

	return api
}
