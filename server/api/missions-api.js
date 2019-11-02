import { Promise } from 'es6-promise'
import { uniqBy } from 'lodash'
import { Router } from 'express'
import { getAll, getOne, query, generateNewDocRef, systems, createMultiple, updateOrCreateMultiple } from '../db'
import { updateMissionEvent, createMissionEvent } from '../lib/logging'
import { swcAuthenticatedMiddleware } from '../lib/swc'
import { celebrate, Joi } from 'celebrate'

function addMapCoordinatesToMission(mission) {
  let startingX = null
  let startingY = null
  let endingX = null
  let endingY = null
  let startingSystemName = null
  let endingSystemName = null

  if (mission.starting_system) {
    const startingSystem = systems.find(s => s.uid === mission.starting_system)
    startingX = startingSystem.x
    startingY = startingSystem.y
    startingSystemName = startingSystem.name
  }
  if (mission.ending_system) {
    const endingSystem = systems.find(s => s.uid === mission.ending_system)
    endingX = endingSystem.x
    endingY = endingSystem.y
    endingSystemName = endingSystem.name
  }
  if (mission.custom_starting_x && mission.custom_starting_y) {
    startingX = mission.custom_starting_x
    startingY = mission.custom_starting_y
  }
  if (mission.custom_ending_x && mission.custom_ending_y) {
    endingX = mission.custom_ending_x
    endingY = mission.custom_ending_y
  }
  
  return {
    ...mission,
    startingSystemName,
    endingSystemName,
    startingX,
    startingY,
    endingX,
    endingY,
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

async function updateMissionStatus(mission, missionStatus, bidStatus, removeContractor, currentUserUid) {
  const updateRefSetArray = []
  const targetUserUids = []
  
  if (mission.contractor_id) {
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
      targetUserUids.push(bid.bidder_id)
      updateRefSetArray.push({ collection: 'bids', id: bid.uid, updateSet: { status: bidStatus }})
    }
  }

  targetUserUids.push(mission.created_by)
  updateRefSetArray.push({
    collection: 'missions',
    id: mission.uid,
    updateSet: {
      status: missionStatus,
      contractor_id: removeContractor ? null : mission.contractor_id,
    }
  })
  const event = await updateMissionEvent(mission, targetUserUids, missionStatus, currentUserUid)
  await updateOrCreateMultiple({
    updateRefSetArray,
    createRefSetArray: [{ collection: 'events', updateSet: event }]
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
      customStartingX: Joi.number().allow(null),
      customStartingY: Joi.number().allow(null),
      customEndingX: Joi.number().allow(null),
      customEndingY: Joi.number().allow(null),
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
      custom_starting_x: req.body.customStartingX,
      custom_starting_y: req.body.customStartingY,
      custom_ending_x: req.body.customEndingX,
      custom_ending_y: req.body.customEndingY,
      status: 'Available',
      created_by: req.swcUid,
    }
    const event = await createMissionEvent(req.body.title, [req.swcUid], req.swcUid)
    const newMissionRef = await generateNewDocRef('missions')
    await createMultiple([
      { collection: 'missions', updateSet, ref: newMissionRef },
      { collection: 'events', updateSet: event, }
    ])
    const newMission = await getOne({ collection: 'missions', id: newMissionRef.id })
    res.status(201).send(newMission)
  })

  api.put('/:id/withdraw', swcAuthenticatedMiddleware, celebrate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    })
  }), async (req, res) => {
    const mission = await getOne({ collection: 'missions', id: req.params.id })
    await updateMissionStatus(mission, 'Withdraw', 'Withdraw', true, req.swcUid)
    const updatedMission = await getOne({ collection: 'missions', id: req.params.id })
    res.status(200).send(updatedMission)
  })
  
  api.put('/:id/decline', swcAuthenticatedMiddleware, celebrate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    })
  }), async (req, res) => {
    const mission = await getOne({ collection: 'missions', id: req.params.id })
    await updateMissionStatus(mission, 'Declined', 'Declined', true, req.swcUid)
    const updatedMission = await getOne({ collection: 'missions', id: req.params.id })
    res.status(200).send(updatedMission)
  })
  
  api.put('/:id/paid', swcAuthenticatedMiddleware, celebrate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    })
  }), async (req, res) => {
    const mission = await getOne({ collection: 'missions', id: req.params.id })
    await updateMissionStatus(mission, 'Paying Out', 'Complete', false, req.swcUid)
    const updatedMission = await getOne({ collection: 'missions', id: req.params.id })
    res.status(200).send(updatedMission)
  })
  
  api.put('/:id/complete', swcAuthenticatedMiddleware, celebrate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    })
  }), async (req, res) => {
    const mission = await getOne({ collection: 'missions', id: req.params.id })
    await updateMissionStatus(mission, 'Approving', 'Active', false, req.swcUid)
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
    res.status(200).send(uniqBy(missionData, i => i.uid))
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
