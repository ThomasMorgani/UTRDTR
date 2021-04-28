// const express = require('express')
const uuid = require('uuid')
const uuidv4 = uuid.v4
const store = require('./db.js')
// console.log(store)
// const db = store.db
// const loki = require('lokijs')
// const db = new loki('utrdtr')
// console.log('store--------')
// console.log(store)
// console.log('store.db--------')
// console.log(store.db)
console.log('store.db.list-------------')
// console.log(db.listCollections())
// const users = store.users
// const users = store.getCollection('users')
const users = store.db.getCollection('users')
// console.log(users)

// let users = db.getCollection('users')
// let users = db.users
// exports.users = users

// let users = db.getCollection('users')
// if (users === null) {
//   console.log('users db == new, creating users')
//   users = db.addCollection('users', { unique: 'id' })
// } else {
//   console.log('users db exits, entries:')
//   console.log(users)
// }

// exports.users = users
// exports.users = db.users

const userDataFormat = function (data) {
  const newID = uuidv4()
  return {
    id: newID,
    // id: data.id || uuidv4(),
    testid: newID,
    name: data.name || '',
    activeGame: data.activeGame || null,
    sessid: data.sessid || null,
    statistics: {
      given: data && data.statistics ? data.statistics.given : 0,
      taken: data && data.statistics ? data.statistics.taken : 0
    }
  }
}

exports.userGet = function (queryValues) {
  // console.log('users get')
  // console.log(queryValues)

  // console.log('store--------')
  // console.log(store)
  // console.log('store.db--------')
  // console.log(store.db)
  // console.log('store.db.list-userGet------------')
  // console.log(store.db.listCollections())

  // console.log(db)
  // console.log(db.listCollections())

  // let users = db.getCollection('users')
  console.log(users.data)
  let user = users.findOne(queryValues)
  // console.log(user)
  if (user) {
    delete user.meta
    delete user['$loki']
  }
  return user
}

exports.userCreate = function (userData) {
  // let users = db.getCollection('users')

  if (!userData) {
    userData = {}
  }
  console.log(users)
  console.log('passed: ', userData)
  let user = userDataFormat(userData)
  console.log('formatted: ', user)

  if (user) {
    users.insert(user)
    store.db.saveDatabase()
    console.log(users.data)
    delete user.meta
    delete user['$loki']
  }
  return user
}

exports.userExists = function (userid) {
  return users.where((u) => u.id === userid)
}

// exports.userUpdate = function(user) {
//   console.log(user)
//   return users.update(user)
// }
