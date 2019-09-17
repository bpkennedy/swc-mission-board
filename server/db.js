import * as admin from 'firebase-admin'
let serviceAccount
if (process.env.NODE_ENV !== 'production') {
  serviceAccount = require('../swc-mission-board-firebase-adminsdk.json')    
}

let db = null

const newDocRef = (collection) => {
  return db.collection(collection).doc()
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

export const createOne = async ({collection, updateSet}) => {
  const newUid = newDocRef(db, collection)
  return db.collection(collection).set(newUid, {
    uid: newUid,
    ...updateSet,
    created_at: new Date(),
    modified_at: new Date(),
  })
}

export const createMultiple = async (refSetArray) => {
  return db.runTransaction(async t => {
    for (const refSet of refSetArray) {
      const newUid = newDocRef(db, refSet.collection)
      await t.set(newUid, {
        uid: newUid,
        ...refSet.updateSet
      })
    }
  })
}

export const initializeDb = (callback) => {
  if (process.env.NODE_ENV === 'production') {
    admin.initializeApp({
      credential: admin.credential.cert({
        'projectId': process.env.FIREBASE_PROJECT_ID,
        'clientEmail': process.env.FIREBASE_CLIENT_EMAIL,
        'privateKey': process.env.FIREBASE_PRIVATE_KEY,
      })
    })
  } else {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://swc-mission-board.firebaseio.com/'
    }) 
  }
  db = admin.firestore()
  callback(db)
}
