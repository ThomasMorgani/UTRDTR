const express = require('express'),
  cors = require('cors'),
  session = require('express-session')
const app = express()
const server = app.listen(3000, function () {
    console.log('server running on port 3000')
  }),
  io = require('socket.io')(server)

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

const db = require('./modules/db.js')
db.databaseInitialize()
// let lokiStore = db.db

const loki = require('connect-loki')(session),
  lokiStore = new loki(),
  path = require('path'),
  sharedsession = require('express-socket.io-session')

// app.db = lokiStore
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Attach session
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: 'secret4UTRDR',
    store: lokiStore
  })
)

///////////////////
// USER SESSION  //
// MV 2 ACTNS, RT//
///////////////////

//TODO
//SET ROUTES ARRAY OF ENDPOINTS TO RUN SESSION CONFIG ON

const gameActions = require('./modules/gameActions')
const userActions = require('./modules/userActions')
// const ioActions = require('./modules/ioActions')
// const utilActions = require('./modules/utilActions')

// Share session with io sockets
io.use(
  sharedsession(
    session({
      resave: false,
      saveUninitialized: true,
      secret: 'secret4UTRDR',
      store: lokiStore
    })
  )
)

io.on('connection', function (socket) {
  //TODO: MOVE TO MODULE
  console.log('io connected')
  // console.log(socket.handshake.session)

  socket.on('gameAction', function (data) {
    console.log('on Game Action')
    console.log(data)
    // console.log(socket.handshake.session)

    let user = userActions.userGet({ id: socket.handshake.session.userid })
    if (!user) {
      //TODO: SETUP SESSION
      console.log('no user session, return')
      return false
    }
    const game = gameActions.gameGet({ id: user.activeGame })
    const gameUserIndex = game.players.findIndex((p) => p.id === user.id)
    const gameUser = game.players[gameUserIndex]
    const turnIncrementTimout = gameActions.gameIncrementTurnTimeout(game)
    socket.join(game.id)

    const incrementTurnRiver = (data) => {
      //This function handles round 5 (up the river down the river)
      //this round is automated except when awaiting players giving drinks
      //
      console.log('incrementTurnRiver function')
      console.log('incrementTurnRiver function')
      console.log('incrementTurnRiver function')
      console.log(data)
      // console.log(game)
      // console.log(io)

      if (data.roundPhase && data.roundPhase >= 8) {
        console.log('emit gameAction gameOver')
        return
      }

      if (data && data.givingDrinks && data.givingDrinks.length > 0) {
        //Give drinks, setTimeout, run this again

        //i think this needs to be handled... if multiple giving drinks..
        //emit incrementriver with next values??
        console.log(
          'givingDrinks exists in passed in data, do we need to emit updated gameData?- returned from func'
        )

        return
      }

      const turn = gameActions.gameRiverIncrement(data)

      let turnIncrementTimout = gameActions.gameIncrementTurnTimeout(turn)
      if (turn.givingDrinks && turn.givingDrinks.length > 0)
        turnIncrementTimout = 0
      if (!turn.drinksGiven && !turnIncrementTimout) turnIncrementTimout = 10000

      //Do we need to do something diff depending on give/take?

      io.in(game.id).emit('gameEvent', {
        event: 'riverIncrement',
        gameData: turn,
        turnTimeLeft: turnIncrementTimout
      })

      if (
        turn.givingDrinks &&
        turn.givingDrinks.length < 1 &&
        turn.drinksGiven &&
        turn.drinksGiven.length < 1
      ) {
        console.log('no one giving drinks')
        console.log('timeout: ', turnIncrementTimout)
        setTimeout(() => {
          console.log('setTimeout')
          console.log('data (game): ', data)
          console.log('turn(could be same as above?): ', turn)
          incrementTurnRiver(turn)
        }, turnIncrementTimout)
      } else {
        return
      }
    }

    switch (data.action) {
      //
      // CHOICE ACTION
      // On player's choice turns 1-4
      case 'choice':
        console.log('choice')
        const isCorrect = gameActions.playerChoice(game, gameUser, data.value)
        const choiceLog = []

        //ADD LOGS
        if (!isCorrect) {
          choiceLog.push(
            gameActions.gameLogFormat(
              user.id,
              null,
              `incorrect guess. Drink ${game.round * 2}. `
            )
          )
        }

        choiceLog.push(
          gameActions.gameLogFormat(
            user.id,
            null,
            `Guessed ${data.value}. Card Was ${
              gameUser.cards[gameUser.cards.length - 1].card
            }${gameUser.cards[gameUser.cards.length - 1].suit}`
          )
        )

        choiceLog.forEach((l) => gameActions.gameLogAdd(game, l))

        //Send choice result
        io.in(game.id).emit('gameEvent', {
          event: 'choiceResult',
          choice: data.value,
          log: choiceLog,
          result: isCorrect,
          player: gameUser,
          givingDrinks: game.givingDrinks,
          turnTimeLeft: !isCorrect ? turnIncrementTimout : null,
          drinks: !isCorrect
            ? [{ player: gameUser.id, drinks: game.round * 2 }]
            : null
        })

        if (!isCorrect) {
          if (game.round <= 4) {
            const turn = gameActions.gameIncrementTurn(game)
            setTimeout(() => {
              io.in(game.id).emit('gameEvent', {
                event: 'turnIncrement',
                // gameData: whats getting updated? players Counts and....
                gameData: turn
              })
            }, turnIncrementTimout)
            if (turn.round === 5) {
              setTimeout(
                () => incrementTurnRiver({ ...game, ...turn }),
                turnIncrementTimout + 3000
              )
            }
          } else {
            console.log('choice result round is greater than 5...now what ')
            setTimeout(() => incrementTurnRiver(game), turnIncrementTimout)
          }
        }

        break
      case 'drinksGive':
        const drinksLog = gameActions.drinksGive(gameUser, game, data.data)
        game.givingDrinks.shift()
        io.in(game.id).emit('gameEvent', {
          event: 'drinksGiven',
          // gameData: whats getting updated? players Counts and....
          drinks: data.data,
          log: drinksLog,
          givingDrinks: game.givingDrinks,
          turnTimeLeft:
            game.givingDrinks.length > 0 ? null : turnIncrementTimout //TODO: is this correct logic?
        })

        if (game.round > 0 && game.round <= 4) {
          turn = gameActions.gameIncrementTurn(game)

          if (turn.round === 5) {
            setTimeout(
              () => incrementTurnRiver({ ...game, ...turn }),
              turnIncrementTimout + 3000
            )
          } else {
            setTimeout(() => {
              io.in(game.id).emit('gameEvent', {
                event: 'turnIncrement',
                // gameData: whats getting updated? players Counts and....
                gameData: turn,
                turnTimeLeft: turnIncrementTimout
              })
            }, turnIncrementTimout)
          }
        } else {
          setTimeout(() => incrementTurnRiver(game), turnIncrementTimout)
        }

        break
      case 'end':
        // const game = gameActions.gameEnd(game)
        //if game
        io.in(game.id).emit('gameEvent', {
          event: 'ended',
          gameData: gameActions.gameEnd(game),
          log: gameActions.gameLogFormat(user.id, null, 'Ended the game')
        })
        break
      case 'joined':
        console.log('io on joined')
        console.log('io on joined')
        console.log('io on joined')
        console.log(io.sockets.adapter.rooms[game.id])
        io.in(game.id).emit('gameEvent', {
          event: 'joined',
          user: gameUser,
          log: gameActions.gameLogFormat(user.id, null, 'Joined the game')
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
