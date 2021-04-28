const express = require('express')
const router = express.Router()
const gameActions = require('../modules/gameActions')
const userActions = require('../modules/userActions')
const utilActions = require('../modules/utilActions')

router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

router.get('/active', function (req, res, next) {
  // console.log(req.session)
  console.log('get /active')
  console.log(req.session)
  // req.session.userid = null
  let user = userActions.userGet({ id: req.session.userid })
  console.log(user)
  if (!user) {
    console.log('No user, todo: start sesison, return error')
    res.json(utilActions.formatResponse('error', 'No user sesh'))
  }
  if (!req.session.gameid) {
    res.json(utilActions.formatResponse('error', 'No Active Game Found'))
  }

  const game = gameActions.gameGet({ id: req.session.gameid })
  if (!game) {
    res.json(utilActions.formatResponse('error', 'Game Expired'))
  } else {
    res.json(utilActions.formatResponse('success', 'Game found', game))
  }
})

router.post('/create', function (req, res, next) {
  // console.log(req.session)
  // console.log(userActions.userExists(req.session.userid))
  // req.session.userid = null
  //TODO: IF SESSION: USERDATA.....
  let user = userActions.userGet({ id: req.session.userid })
  if (!user) {
    //TODO: SETUP USER HERE
    res.json({
      status: 'error',
      message: 'User not initialized. Refresh, try again',
      data: {
        sesh: req.session
      }
    })
    return
  }

  console.log(user)
  if (req.body.playerName && user.name !== req.body.playerName) {
    user.name = req.body.playerName
    // userActions.userUpdate(user)
    console.log('UPDATED USER')
    console.log(user)
  }

  let game = gameActions.gameCreate(req.body, user)
  console.log('gamejs if game')
  console.log(game)
  if (game) {
    if (gameActions.playerAdd(game, user)) {
      req.session.gameid = game.id
      gameActions.gameLogAdd(
        game,
        gameActions.gameLogFormat(user.id, null, 'Created New Game')
      )
      res.json(utilActions.formatResponse('success', 'Game create', game))
    }
  } else {
    //return error
    console.log('failed to created game')
  }

  // res.json({
  //   status: 'xx',
  //   message: 'testing'
  // })
  //   console.log(req.params)
  //   res.send({ status: 'succes', message: 'Game Created', data: req.body })
})

router.post('/join', function (req, res, next) {
  const user = userActions.userGet({ id: req.session.userid })
  console.log(req.session)
  console.log(user)
  if (req.body.playerName && user.name !== req.body.playerName) {
    user.name = req.body.playerName
    // userActions.userUpdate(user)
    console.log('UPDATED USER')
    console.log(user)
  }
  const game = gameActions.playerJoin(req.body, user)
  //req.session.gameid = game.id
  console.log('gameeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
  console.log(game)
  if (game) {
    req.session.gameid = game.id
    user.activeGame = game.id
    //BROADCAST IO HERE

    res.json(utilActions.formatResponse('success', 'Joined', game))
  } else {
    res.json(
      utilActions.formatResponse(
        'error',
        'Failed to find game with provided credentials.',
        game
      )
    )
  }
})

module.exports = router
