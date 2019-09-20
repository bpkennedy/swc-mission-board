import * as admin from 'firebase-admin'

let db = null

const newDocRef = async (collection) => {
  return await db.collection(collection).doc()
}

export const getOne = async ({id, collection}) => {
  const doc = await db.collection(collection).doc(id).get()
  if (!doc.exists) {
    return null
  }
  return doc.data()
}

export const getAll = async ({collection}) => {
  const items = []
  const snapshot = await db.collection(collection).get()
  snapshot.forEach(doc => {
    items.push(doc.data())
  })
  return items
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
  return getOne({ id: uid, collection: 'tokens'})
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
  callback(db)
}
