const express = require('express')
const cors = require('cors')
const app = express()
const server = app.listen(3000, function () {
  console.log('server running on port 3000')
})

///////////////////
// CORS SETTINGS //
///////////////////

const allowedOrigins = [
  'http://localhost:3000',
  'http://yourapp.com',
  'http://localhost:8080'
]
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true)
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          'The CORS policy for this site does not ' +
          'allow access from the specified Origin...'
        return callback(new Error(msg), false)
      }
      return callback(null, true)
    }
  })
)

///////////
console.log('pass cors')
///////////

const session = require('express-session')
const loki = require('connect-loki')(session)
// const lokiStore = new loki({
//   autosave: true
// })

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Attach session
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: 'secret4UTRDR',
    store: new loki({
      autosave: true
    })
  })
)

///////////////////
// USER SESSION  //
// MV 2 ACTNS, RT//
///////////////////

//TODO
//SET ROUTES ARRAY OF ENDPOINTS TO RUN SESSION CONFIG ON

// app.use(function(req, res, next) {
//   console.log('setup/load user session')
//   console.log('Requested path: %s', req.path)
//   let user
//   if (req.session.userid) {
//     console.log('session exists: ')
//     console.log(req.session.userid)
//     user = userActions.userGet({ id: req.session.userid })
//     console.log(user)
//     if (!user) {
//       console.log('user not found, created: ')
//       user = userActions.userCreate({ id: req.session.userid })
//     } else {
//       req.session.userData = user
//     }
//   } else {
//     console.log('session not found: ')
//     user = userActions.userCreate()
//     console.log(user)
//     req.session.userid = user.id
//     req.session.userData = user
//   }
//   next()
// })
const path = require('path')
const io = require('socket.io')(server)

const gameActions = require('./modules/gameActions')
const ioActions = require('./modules/ioActions')
const userActions = require('./modules/userActions')
const utilActions = require('./modules/utilActions')

// Share session with io sockets
// const sharedsession = require('express-socket.io-session')
// io.use(sharedsession(session))

io.on('connection', function (socket) {
  //TODO: MOVE TO MODULE
  // console.log(socket)
  console.log('io connected')
  // console.log(socket.handshake.session)

  //SET USER, GAME
  //TODO: TEST USER/GAME EXISITS

  socket.on('gameAction', function (data) {
    console.log('on Game Action')
    // console.log(data)
    // console.log(socket.handshake.session)

    let user = userActions.userGet({ id: socket.handshake.session.userid })
    if (!user) {
      console.log('no user session, return')
      return false
    }
    const game = gameActions.gameGet({ id: user.activeGame })
    const gameUserIndex = game.players.findIndex((p) => p.id === user.id)
    const gameUser = game.players[gameUserIndex]

    // console.log('game', game)
    // console.log('gameUserIndex', gameUserIndex)
    // console.log('gameUser', gameUser)
    socket.join(game.id)

    switch (data.action) {
      case 'joined':
        console.log('io on joined')
        io.in(game.id).emit('gameEvent', {
          event: 'joined',
          user: user,
          log: gameActions.gameLogFormat(user, null, 'Joined the game')
        })
        break

      case 'start':
        console.log('start')

        if (game.state === 'active' || game.state === 'ended') break
        const gameData = gameActions.gameStart(game)
        const log = gameActions.gameLogFormat(
          user.id,
          null,
          'Game started. Deck, players shuffled.'
        )
        game.log.push(log)
        console.log('after game start, now emit')
        io.in(game.id).emit('gameEvent', {
          event: 'started',
          gameData: gameData,
          log: log
        })
        break

      case 'choice':
        console.log('choice')
        console.log(data)
        const isCorrect = gameActions.playerChoice(game, gameUser, data.value)
        io.in(game.id).emit('gameEvent', {
          event: 'choiceResult',
          result: isCorrect,
          player: gameUser
        })

        //Choice made by current user

        break

      default:
        console.log('no action match found, sent default resp')
        io.to(game.id).emit('testResp', {
          msg: 'fallback gameAction response',
          sent: data || null,
          sess: socket.handshake.session || null,
          game: game || null
        })
    }
  })
})

const gameRouter = require('./routes/game')
const indexRouter = require('./routes/index')
const userRouter = require('./routes/user')

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/game', gameRouter)
app.use('/user', userRouter)

module.exports = app
