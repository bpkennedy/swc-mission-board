import { Promise } from 'es6-promise'
import { Router } from 'express'
import { getAll, getOne, query, createOne, systems, updateMultiple } from '../db'
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

async function withdrawMission(mission) {
  const updateMultipleRefSet = []
    const activeBidForMissionQuery = [{
      field: 'mission_id',
      comparison: '==',
      value: mission.uid,
    }, {
      field: 'bidder_id',
      comparison: '==',
      value: mission.contractor_id,
    }, {
      field: 'status',
      comparison: '==',
      value: 'Active',
    }]
    const activeBids = await query({
      collection: 'bids',
      querySets: activeBidForMissionQuery
    })

    for (const bid of activeBids) {
      updateMultipleRefSet.push({ collection: 'bids', id: bid.uid, updateSet: { status: 'Withdrawn'}})
    }
    updateMultipleRefSet.push({
      collection: 'missions',
      id: mission.uid,
      updateSet: {
        status: 'Withdrawn',
        contractor_id: null,
      }
    })
    await updateMultiple(updateMultipleRefSet)
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
  
  api.put('/:id', swcAuthenticatedMiddleware, celebrate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    })
  }), async (req, res) => {
    const mission = await getOne({ collection: 'missions', id: req.params.id })
    await withdrawMission(mission)
    const updatedMission = await getOne({ collection: 'missions', id: req.params.id })
    res.status(200).send(updatedMission)
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
    res.status(200).send(hydratedSystemMissions(publicMissions).map(addMapCoordinatesToMission))
  })
  
  api.get('/me', swcAuthenticatedMiddleware, async (req, res) => {
    const myWorkingMissionsQuery = [{
      field: 'contractor_id',
      comparison: '==',
      value: req.swcUid
    }]
    const myCreatedMissionsQuery = [{
      field: 'created_by',
      comparison: '==',
      value: req.swcUid
    }]
    const workingMissions = query({
      collection: 'missions',
      querySets: myWorkingMissionsQuery
    })
    const createdMissions = query({
      collection: 'missions',
      querySets: myCreatedMissionsQuery
    })
    const myMissionsResponse = await Promise.all([workingMissions, createdMissions])
    const missionData = [
      ...hydratedSystemMissions(myMissionsResponse[0]).map(addMapCoordinatesToMission),
      ...hydratedSystemMissions(myMissionsResponse[1]).map(addMapCoordinatesToMission),
    ]
    res.status(200).send(missionData)
  })
  
  api.get('/board/:id', swcAuthenticatedMiddleware, async (req, res) => {
    const appUser = await getOne({ collection: 'users', id: req.swcUid})
    if (appUser.board_ids.includes(req.params.id)) {
      const BoardMissionsQuery = [{
        field: 'board_ids',
        comparison: 'array-contains',
        value: req.params.id
      }]
      const boardMissions = await query({
        collection: 'missions',
        querySets: BoardMissionsQuery
      })
      res.status(200).send(hydratedSystemMissions(boardMissions).map(addMapCoordinatesToMission))
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
  
  api.get('/:id/bids', swcAuthenticatedMiddleware, async (req, res) => {
    const missionBiddersQuery = [{
      field: 'mission_id',
      comparison: '==',
      value: req.params.id
    }]
    const missionBids = await query({
      collection: 'bids',
      querySets: missionBiddersQuery
    })
    res.status(200).send(missionBids)
  })

	return api
}
