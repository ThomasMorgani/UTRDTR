const loki = require('lokijs')

// We will use autoload (one time load at instantiation), and autosave  with 4 sec interval.
let db = new loki('store.db', {
    autoload: true,
    autoloadCallback: databaseInitialize,
    autosave: true,
    autosaveInterval: 4000 // save every four seconds for our example
  }),
  games,
  users

// implement the autoloadback referenced in loki constructor
function databaseInitialize() {
  // on the first load of (non-existent database), we will have no collections so we can
  //   detect the absence of our collections and add (and configure) them now.
  console.log('databaseInitialize')
  // console.log(db.listCollections())
  games = db.getCollection('games')
  if (games === null) {
    console.log('games db == new, creating games')
    games = db.addCollection('games', { unique: 'id', autoupdate: true })
  } else {
    console.log('games db exits, entries:')
    // console.log(games)
  }

  users = db.getCollection('users')
  if (users === null) {
    console.log('users db == new, creating users')
    users = db.addCollection('users', { unique: 'sessid', autoupdate: true })
  } else {
    console.log('users db exits, entries:')
    // console.log(users)
  }
}

exports.db = db
exports.databaseInitialize = databaseInitialize
// exports.getCollection = function (collection) {
//   return db.getCollection(collection)
// }
