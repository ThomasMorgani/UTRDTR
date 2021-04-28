const express = require('express')
const router = express.Router()
const userActions = require('../modules/userActions')
const gameActions = require('../modules/gameActions')

router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

router.get('/session', function (req, res, next) {
  //Moved this to main app, this should be checked every request
  console.log('hi from /user/session')
  let user
  console.log(req.sessionID)
  console.log(req.session)

  // if (req.session.userid) {
  //   console.log(req.session.userid)
  //   user = userActions.userGet({ id: req.session.userid })
  //   console.log(user)
  //   if (!user) {
  //     user = userActions.userCreate({ id: req.session.userid })
  //   } else {
  //     if (req.session.gameid) {
  //       const game = gameActions.gameGet({ id: req.session.gameid })
  //       if (game) {
  //         user.activeGame = game.id
  //       } else {
  //         delete req.session.gamid
  //       }
  //     }
  //   }
  // } else {
  if (req.sessionID) {
    // console.log(req.session.userid)
    user = userActions.userGet({ sessid: req.sessionID })
    console.log('first user =')
    console.log(user)
    if (!user) {
      user = userActions.userCreate({ sessid: req.sessionID })
    }

    if (req.session.gameid) {
      const game = gameActions.gameGet({ id: req.session.gameid })
      if (game && game.status !== 'ended') {
        user.activeGame = game.id
      } else {
        user.activeGame = null
      }
    }
    if (user) {
      req.session.userid = user.id
      req.session.userData = user
    }
  }
  res.json({
    status: 'success',
    message: 'reached user session route',
    data: user
  })
})

module.exports = router
