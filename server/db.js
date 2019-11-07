import { Promise } from 'es6-promise'
import fs from 'fs'
import * as admin from 'firebase-admin'
import Papa from 'papaparse'
// const createCsvWriter = require('csv-writer').createObjectCsvWriter
// const csvWriter = createCsvWriter({
//   path: './dev-data/systems.csv',
//   header: [
//       {id: 'uid', title: 'uid'},
//       {id: 'name', title: 'name'},
//       {id: 'controlled_by', title: 'controlled_by'},
//       {id: 'x', title: 'x'},
//       {id: 'y', title: 'y'},
//       {id: 'created_at', title: 'created_at'},
//       {id: 'modified_at', title: 'modified_at'}
//   ]
// })


export let systems = []
export let db = null

export async function generateNewDocRef (collection) {
  return await db.collection(collection).doc()
}

// async function createCSVForSystems() {
//   await csvWriter.writeRecords(systems.map(s => ({
//     ...s,
//     created_at: s.created_at.toDate(),
//     modified_at: s.modified_at.toDate(),
//   })))
// }

async function loadLocalSystems() {
  const file = fs.createReadStream('./dev-data/systems.csv');
  return new Promise(resolve => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: results => {
        resolve(results.data);
      }
    })
  })
}

async function loadSystems() {
  // systems = await getAll({ collection: 'systems' })
  // await createCSVForSystems()
  if (process.env.TRAVIS || process.env.HEROKU) {
    systems = await getAll({ collection: 'systems' })
  } else {
    systems = await loadLocalSystems()
  }
}

function stripAnonymousMissions (missions) {
  return missions.map(mission => {
    if (mission.anonymous === true) {
      return { ...mission, created_by: null }
    }
    return mission
  })
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

export const createOne = async ({ collection, updateSet, id }) => {
  let uid
  if (id) {
    uid = id
  } else {
    const newRef = await generateNewDocRef(collection)
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

export const updateMultiple = async (refSetArray) => {
  return db.runTransaction(async t => {
    for (const refSet of refSetArray) {
      await t.update(db.collection(refSet.collection).doc(refSet.id), { 
        ...refSet.updateSet,
        modified_at: new Date(),
      })
    }
  })
}

export const createMultiple = async (refSetArray) => {
  return db.runTransaction(async t => {
    for (const refSet of refSetArray) {
      const newRef = refSet.ref ? refSet.ref : await generateNewDocRef(refSet.collection)
      const uid = newRef.id
      await t.set(newRef, {
        uid,
        ...refSet.updateSet,
        created_at: new Date(),
        modified_at: new Date(),
      })
    }
  })
}

export const updateOrCreateMultiple = async ({ updateRefSetArray, createRefSetArray }) => {
  return db.runTransaction(async t => {
    for (const refSet of createRefSetArray) {
      const newRef = refSet.ref ? refSet.ref : await generateNewDocRef(refSet.collection)
      const uid = newRef.id
      await t.set(newRef, {
        uid,
        ...refSet.updateSet,
        created_at: new Date(),
        modified_at: new Date(),
      })
    }
    for (const refSet of updateRefSetArray) {
      await t.update(db.collection(refSet.collection).doc(refSet.id), {
        ...refSet.updateSet,
        modified_at: new Date(),
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
  loadSystems()
  callback(db)
}
