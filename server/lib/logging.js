import { generateNewDocRef, db } from '../db'
import { userHandle } from '../api/users-api'
import { uniqBy } from 'lodash'

export const eventToNotification = (event) => {
  if (typeof event.created_at.toDate === 'function') {
    return {
      uid: event.uid,
      type: event.type,
      created_at: event.created_at.toDate().toLocaleString(),
      message: event.message,
      target_user_uids: event.target_user_uids,
      target_user_read: event.target_user_read,
      origin_user_uid: event.origin_user_uid,
    }
  } else {
    return {
      uid: event.uid,
      type: event.type,
      created_at: event.created_at.toLocaleString(),
      message: event.message,
      target_user_uids: event.target_user_uids,
      target_user_read: event.target_user_read,
      origin_user_uid: event.origin_user_uid,
    }
  }
}

export const logUserEvent = async ({ message, targetUserUids, originUserUid }) => {
  if (message && targetUserUids.length > 0 && originUserUid) {
    const newRef = await generateNewDocRef('events')
    const uid = newRef.id

    db.collection('events').doc(uid).set({
      uid,
      ...newLog({ message, targetUserUids, originUserUid }),
    })
  } else {
    throw new Error(`Cannot log user event with params = message:${message}, targetUserUids:${JSON.stringify(targetUserUids)}, originUserUid:${originUserUid}.`)
  }
}

export function newLog({ message, targetUserUids, originUserUid, type }) {
  if (message && targetUserUids.length > 0 && originUserUid) {
    return {
      message,
      type,
      origin_user_uid: originUserUid,
      target_user_uids: uniqBy(targetUserUids, tu => tu.uid),
      target_user_read: [],
      created_at: new Date(),
      modified_at: new Date(),
    }
  }
  throw new Error(`Cannot create new log object with params = message:${message}, targetUserUids:${JSON.stringify(targetUserUids)}, originUserUid:${originUserUid}.`)
}

export async function createFeedbackEvent(missionTitle, targetUserUids, currentUserUid) {
  const currentUserHandle = await userHandle(currentUserUid)
  return newLog({
    message: `${missionTitle} - feedback left by ${currentUserHandle}`,
    targetUserUids,
    originUserUid: currentUserUid,
    type: 'feedback',
  })
}

export async function createMissionEvent(missionTitle, targetUserUids, currentUserUid) {
  const currentUserHandle = await userHandle(currentUserUid)
  return newLog({
    message: `${missionTitle} - mission created by ${currentUserHandle}`,
    targetUserUids,
    originUserUid: currentUserUid,
    type: 'missions',
  })
}

export async function updateMissionEvent(mission, targetUserUids, missionStatus, currentUserUid) {
  const currentUserHandle = await userHandle(currentUserUid)
  const message = `${mission.title} - ${currentUserHandle} changed mission from ${mission.status} to ${missionStatus}.`
  return newLog({
    message,
    targetUserUids,
    originUserUid: mission.created_by,
    type: 'missions',
  })
}

export async function createBidEvent(mission, targetUserUids, currentUserUid) {
  const biddingUserHandle = await userHandle(currentUserUid)
  const message = `${mission.title} - ${biddingUserHandle} sent a bid for this mission.`
  return newLog({
    message,
    targetUserUids,
    originUserUid: mission.created_by,
    type: 'bids',
  })
}

export async function acceptBidEvent(mission, targetUserUids, bid, currentUserUid) {
  const currentUserHandle = await userHandle(currentUserUid)
  const biddingUserHandle = await userHandle(bid.created_by)
  const message = `${mission.title} - ${currentUserHandle} accepted a bid from ${biddingUserHandle} for this mission.`
  return newLog({
    message,
    targetUserUids,
    originUserUid: mission.created_by,
    type: 'bids',
  })
}