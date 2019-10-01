import { Promise } from 'es6-promise'
import pLimit from 'p-limit'
import axios from 'axios'
import { uniqBy } from 'lodash'
import qs from 'qs'
const oauth_url = 'http://www.swcombine.com/ws/oauth2/token/'
const character_url = 'http://www.swcombine.com/ws/v1.0/character/'
const sectors_url = 'http://www.swcombine.com/ws/v1.0/galaxy/sectors/'
const systems_url = 'http://www.swcombine.com/ws/v1.0/galaxy/systems/'
const client_id = process.env.SWCOMBINE_CLIENT_ID
const client_secret = process.env.SWCOMBINE_CLIENT_SECRET
const redirect_uri = process.env.SWCOMBINE_REDIRECT_URI

export const refreshAccessToken = async (refresh_token) => {
  const request = {
    url: oauth_url,
    method: 'POST',
    data: qs.stringify({
      grant_type: 'refresh_token',
      refresh_token,
      client_id,
      client_secret,
    }),
    headers: {
      'Accept': 'application/json'
    }
  }
  return axios(request)
}

export const getAccessToken = async (code) => {
  const request = {
    url: oauth_url,
    method: 'POST',
    data: qs.stringify({
      code,
      client_id,
      client_secret,
      grant_type: 'authorization_code',
      redirect_uri,
      access_type: 'offline'
    }),
    headers: {
      'Accept': 'application/json'
    }
  }
  try {
    return axios(request)
  } catch(response) {
    throw response.response.data.error
  }
}

export const getSwcUserInfo = async (uid, accessToken) => {
	return axios.get(character_url + uid + '/', {
		params: {
			'access_token': accessToken,
		},
		headers: {
			'Accept': 'application/json'
		}
	})
}

async function getSwcUserUid(accessToken) {
  return axios.get(character_url, {
    params: {
      'access_token': accessToken,
    },
    headers: {
      'Accept': 'application/json'
    },
  })
}

export const swcAuthenticatedMiddleware = async (req, res, next) => {
  const { data } = await getSwcUserUid(req.get('x-swcmb-access-token'))
  if (data) {
    req.swcUid = data.character.uid
    req.swcToken = req.get('x-swcmb-access-token')
  }
  next()
}

const getSector = async (uid) => {
  const { data } = await axios.get(sectors_url + uid, {
    headers: {
      'Accept': 'application/json'
    },
  })
  const sector = data['galaxy-sector']
  let systems = []
  if (sector.systems.system && sector.systems.system.length > 0) {
    systems = sector.systems.system.map(sys => sys.attributes.uid)
  }
  return {
    uid: sector.uid,
    name: sector.name,
    controlled_by: sector['controlled-by'].value ? sector['controlled-by'].value : null,
    systems,
  }
}

export const getGalaxySectorsFromCombine = async () => {
  let allSectors = []
  let allSectorUids = []
  const numberFiftySetRequests = 10
  for (let i = 0; i < numberFiftySetRequests; i++) {
    const { data } = await axios.get(sectors_url, {
      params: {
        'start_index': i * 50,
      },
      headers: {
        'Accept': 'application/json'
      },
    })
    if (data['galaxy-sectors']['sector'].length) {
      data['galaxy-sectors']['sector'].map(sector => allSectorUids.push(sector.attributes.uid))
    }
  }
  const promiseLimit = pLimit(20)
  const sectorGetRequests = []
  allSectorUids = uniqBy(allSectorUids, (item) => item)
  for (const sectorUid of allSectorUids) {
    sectorGetRequests.push(promiseLimit(() => getSector(sectorUid)))
  }
  const results = await Promise.all(sectorGetRequests)
  results.map(result => allSectors.push(result))
  return allSectors
}

export const getGalaxySystemsFromCombine = async () => {
  let allSystems = []
  const numberFiftySetRequests = 20
  for (let i = 0; i < numberFiftySetRequests; i++) {
    const { data } = await axios.get(systems_url, {
      params: {
        'start_index': i * 50,
      },
      headers: {
        'Accept': 'application/json'
      },
    })
    if (data['galaxy-systems']['system'].length) {
      data['galaxy-systems']['system'].map(system => allSystems.push({
        uid: system.attributes.uid,
        name: system.attributes.name,
        controlled_by: system['controlled-by'].value ? system['controlled-by'].value : null,
        x: system.coordinates.galaxy.attributes.x,
        y: system.coordinates.galaxy.attributes.y,
      }))
    }
  }
  allSystems = uniqBy(allSystems, (item) => item.uid)
  return allSystems
}
