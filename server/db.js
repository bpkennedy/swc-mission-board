import * as admin from 'firebase-admin'
import { stripAnonymousMissions } from './lib/util'

export let systems = []
let db = null

const newDocRef = async (collection) => {
  return await db.collection(collection).doc()
}

function iterateSnapshotForItems(snapshot) {
  if (snapshot.empty) {
    return []
  }

  const items = []
  for (let p=0;p < snapshot.docs.length; p++) {
    items.push(snapshot.docs[p].data())
  }
  return stripAnonymousMissions(items)
}

export const getOne = async ({ id, collection }) => {
  const doc = await db.collection(collection).doc(id).get()
  if (!doc.exists) {
    return null
  }
  return doc.data()
}

export const removeOne = async ({ id, collection }) => {
  return db.collection(collection).doc(id).delete()
}

export const getAll = async ({collection}) => {
  const snapshot = await db.collection(collection).get()
  return iterateSnapshotForItems(snapshot)
}

export const query = async ({ collection, querySets }) => {
  let ref = db.collection(collection)
  let query
  for (let p=0; p < querySets.length; p++) {
    if (p === 0) {
      query = ref.where(querySets[p].field, querySets[p].comparison, querySets[p].value)
    } else {
      query.where(querySets[p].field, querySets[p].comparison, querySets[p].value)
    }
  }
  const snapshot = await query.get()

  return iterateSnapshotForItems(snapshot)
}

export const updateOne = async ({ id, collection, updateSet }) => {
  return db.collection(collection).doc(id).update({
    ...updateSet,
    modified_at: new Date(),
  })
}

export const updateMultiple = async (refSetArray) => {
  await db.runTransaction(t => {
    for (const refSet of refSetArray) {
      t.update(db.collection(refSet.collection).doc(refSet.id), refSet.updateSet)
    }
  })
}

export const createOne = async ({ collection, updateSet, id }) => {
  let uid
  if (id) {
    uid = id
  } else {
    const newRef = await newDocRef(collection)
    uid = newRef.id
  }
  await db.collection(collection).doc(uid).set({
    uid,
    ...updateSet,
    created_at: new Date(),
    modified_at: new Date(),
  })
  return getOne({ id: uid, collection })
}

export const createMultiple = async (refSetArray) => {
  return db.runTransaction(async t => {
    for (const refSet of refSetArray) {
      const newRef = await newDocRef(refSet.collection)
      const uid = newRef.id
      await t.doc(uid).set({
        uid,
        ...refSet.updateSet
      })
    }
  })
}

async function loadSystems() {
  systems = await getAll({ collection: 'systems' })
}

export const initializeDb = (callback) => {
  if (process.env.HEROKU === 'true' || process.env.TRAVIS === 'true') {
    admin.initializeApp({
      credential: admin.credential.cert({
        'projectId': process.env.FIREBASE_PROJECT_ID,
        'clientEmail': process.env.FIREBASE_CLIENT_EMAIL,
        'privateKey': process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      })
    })
  } else {
    const serviceAccount = require('../swc-mission-board-firebase-adminsdk.json')
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://swc-mission-board.firebaseio.com/'
    }) 
  }
  db = admin.firestore()
  loadSystems()
  callback(db)
}
