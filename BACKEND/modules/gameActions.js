const uuid = require('uuid')
const uuidv4 = uuid.v4
const store = require('./db.js')
const db = store.db

const games = db.getCollection('games')
// console.log(games)

//TODO: CARDS PER GAME SHOULD NOT BE SENT TO CLIENT

const deckGenerate = function () {
  const suits = [
    { name: 'spades', abv: 'S' },
    { name: 'diamonds', abv: 'D' },
    { name: 'clubs', abv: 'C' },
    { name: 'hearts', abv: 'H' }
  ]
  const values = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
    'A'
  ]
  const deck = new Array()
  let value = 2
  for (let x = 0; x < values.length; x++) {
    for (let i = 0; i < suits.length; i++) {
      const card = {
        card: values[x],
        suit: suits[i].abv,
        suitName: suits[i].name,
        value: value
      }
      deck.push(card)
    }
    value++
  }
  return deck
}

const deckShuffle = function (deck, iterations = 1000) {
  for (let i = 0; i < iterations; i++) {
    let location1 = Math.floor(Math.random() * deck.length)
    let location2 = Math.floor(Math.random() * deck.length)
    let tmp = deck[location1]

    deck[location1] = deck[location2]
    deck[location2] = tmp
  }
  return deck
}

exports.drinksGive = function (gameUser, game, drinks) {
  const logs = []
  // console.log(gameUser)
  // console.log(game)
  // console.log(drinks)
  // let drinksCount = 0
  drinks.forEach((d) => {
    let destPlayer =
      game.players[game.players.findIndex((p) => p.id === d.player)]
    let log = this.gameLogFormat(
      gameUser.id,
      d.player,
      `Gave ${destPlayer.name} ${
        d.drinks === 1 ? '1 Drink' : d.drinks + ' Drinks'
      }`
    )
    log.drinks = d.drinks
    destPlayer.gameStats.drinksTaken += d.drinks
    logs.push(log)
    this.gameLogAdd(game, log)
  })
  // game.givingDrinks.shift()
  store.db.saveDatabase()
  return logs
}

exports.drinksSetGiving = function (game, card) {
  game.players.forEach((p) => {
    if (p.cards.find((c) => c.card === card.card)) {
      game.givingDrinks.push(p)
    }
  })
  return game.givingDrinks
}

exports.gameCreate = function (gameData, user) {
  // console.log(user)
  // let games = db.getCollection('games')
  let game = gameDataFormat({ ...gameData, state: 'active' }, user)
  game.cards = deckShuffle(deckGenerate()) //eventually set custom card styles?
  game.players = []
  games.insert(game)
  if (game) {
    store.db.saveDatabase()
    delete game.meta
    delete game['$loki']
  }
  return game
}

const gameDataFormat = function (gameData, user) {
  console.log('gameDataFormat')
  // console.log(gameData)
  return {
    id: gameData.id || uuidv4(),
    activePlayer: null,
    cards: [],
    cardsRiver: {
      give: [],
      take: []
    },
    drinksGiven: [],
    isActive: true,
    givingDrinks: [],
    host: user.id,
    log: [],
    pin: gameData.pin || 1234, //generate pin
    players: [],
    playersCount: gameData.playersCount || 8,
    roomId: '111-111-111',
    roomName: gameData.roomName || 'Generate unique name',
    round: 1,
    roundPhase: 0,
    state: 'pending'
  }
}
exports.gameEnd = function (game) {
  game.isActive = false
  game.state = 'ended'

  return game
}
exports.gameGet = function (queryValues) {
  // console.log(gameid)
  // console.log(games)
  // let games = db.getCollection('games')
  let game = games.findOne(queryValues)
  if (game) {
    console.log('game was found===')
    delete game.meta
    delete game['$loki']
  }
  return game
}

exports.gameIncrementTurnTimeout = function (game) {
  if (!game || !game.round) {
    return 0
  }

  if (game.round < 5) {
    return game.round * 3000 < 5000 ? 5000 : game.round * 3000
  } else {
    const time = game.cardsRiver.give.length * 3000
    return time < 5000 ? 5000 : time
  }
}

exports.gameIncrementTurn = function (game) {
  const currentActivePlayerIndex = game.players.findIndex(
    (p) => p.id === game.activePlayer
  )
  if (game.round < 5) {
    if (currentActivePlayerIndex === game.players.length - 1) {
      game.round++
      if (game.round === 5) {
        game.roundPhase = 0
        game.activePlayer = ''
      } else {
        game.activePlayer = game.players['0'].id
      }
    } else {
      game.activePlayer = game.players[currentActivePlayerIndex + 1].id
    }
  }
  store.db.saveDatabase()
  return {
    activePlayer: game.activePlayer || '',
    drinksGiven: game.drinksGiven || '',
    givingDrinks: game.givingDrinks || [],
    round: game.round || null,
    roundPhase: game.roundPhase || null,
    riverCard: game.riverCard || null
  }
}

exports.gameLogAdd = function (gameData, log) {
  gameData.log.push(log)
  store.db.saveDatabase()
  return gameData
}

exports.gameLogFormat = function (
  sourcePlayer,
  targetPlayer,
  text,
  type,
  data
) {
  //Start with general text log
  //TODO: reformat logs, graphics, etc.
  //display guess, right/wrong, card drawn
  //set multiple log types
  //- Game messages
  //- Drinks given
  //- Turns (answers, result, etc)
  return {
    data: data || null,
    sourcePlayer: sourcePlayer || null,
    targetPlayer: targetPlayer || null,
    text: text || '',
    type: type || 'text',
    timestamp: Date.now()
  }
}

exports.gameRiverIncrement = function (game) {
  console.log(game.cardsRiver)
  console.log(game.round)
  console.log(game.roundPhase)
  if (!game) {
    console.log('gameRiverIncrement: no game passed')
    return false
  }
  if (!game.cardsRiver) {
    game.cardsRiver = {
      give: [],
      take: []
    }
  }

  game.activePlayer = ''
  game.round = 5
  game.roundPhase = game.roundPhase ? game.roundPhase + 1 : 1
  game.drinksGiven = []
  game.givingDrinks = []

  const riverCards = game.cardsRiver
  const riverCard = game.cards.splice(0, 1)['0']
  const roundDrinks = game.cardsRiver.give.length * 2
  let roundAction = ''

  if (riverCards.give.length > riverCards.take.length) {
    roundAction = 'take'
    riverCards.take.push(riverCard)
  } else {
    riverCards.give.push(riverCard)
    roundAction = 'give'
    this.drinksSetGiving(game, riverCard)
  }

  const roundCard =
    game.cardsRiver[roundAction][game.cardsRiver[roundAction].length - 1]

  //PICKCUP HWERE
  console.log(roundCard)
  game = this.gameLogAdd(
    game,
    this.gameLogFormat('0', null, `Card was ${roundCard.value}`, null, {
      title: `RIVER ${roundAction} ${roundDrinks}`
    })
  )

  if (!game.givingDrinks || game.givingDrinks.length < 1) {
    game = this.gameLogAdd(
      game,
      this.gameLogFormat('0', null, `No one had a ${roundCard.value}`, null, {
        title: `RIVER ${roundAction} ${roundDrinks}`
      })
    )
  }

  console.log('incr river after running drinksSetGiving, game updated?')
  // console.log(game)
  console.log(game.round)
  console.log(game.roundPhase)
  console.log(game.cardsRiver)
  store.db.saveDatabase()
  console.log(game)
  return game
}

exports.gameStart = function (game) {
  console.log('start game method')
  console.log('game data received', game)
  //user deckshuffle for now, move to generic shuffle method
  game.players = deckShuffle(game.players, 49)
  game.state = 'active'
  // console.log(game, game.state)
  game.playersCount = game.players.length
  game.activePlayer = game.players['0'].id
  // console.log(game)
  let gameData = {}

  //testing, start at round
  const round = 4
  game.round = round
  game.players.forEach((p) => (p.cards = game.cards.splice(0, round - 1)))
  // game.players['0'].cards = game.cards.splice(0, round - 1)
  // game.players['1'].cards = game.cards.splice(0, round - 1)
  //end testing

  if (game) {
    gameData = { ...game }
    //delete lokiMeta
    if (gameData.log) {
      delete gameData.log
    }
  }
  return gameData
}

// exports.gameExists = function(gameid) {
//   return games.where(g => g.id === gameid)
// }

// exports.gameUpdate = function(game) {
//   return games.update(game)
// }

exports.playerAdd = function (gameData, userData) {
  //if game/gameData exists, if user/userData exist
  //if game isActive
  //if player not already in players
  if (!userData.name) {
    userData.name = 'RNDM NAME'
  }
  gameData.players.push({
    ...userData,
    cards: [],
    isHost: gameData.players.length < 1,
    gameStats: {
      drinksGiven: 0,
      drinksTaken: 0
    }
  })
  userData.activeGame = gameData.id
  console.log('gameData from playerAdd')
  // console.log(gameData)
  store.db.saveDatabase()
  return true
}

exports.playerChoice = function (game, player, choice) {
  //recieves game = obj: current game data, player = obj: game's player data
  //choice: str: player's choice
  console.log('playerChoice')

  const card = game.cards['0']
  let isCorrect = null
  console.log(card)
  console.log(choice)
  switch (game.round) {
    case 1:
      if (choice === 'red') {
        isCorrect = card.suit === 'D' || card.suit === 'H'
      } else if (choice === 'black') {
        isCorrect = card.suit === 'C' || card.suit === 'S'
      } else {
        console.log('no color choice match')
        console.log('choice', choice)
        console.log('card', card)
      }
      break
    case 2:
      isCorrect =
        choice === 'higher'
          ? card.value > player.cards['0'].value
          : card.value < player.cards['0'].value
      break
    case 3:
      const playerCards = [...player.cards].sort((a, b) => a.value - b.value)
      // console.log(playerCards)
      // console.log(playerCards['0'].value < card.value)
      // console.log(card.value < playerCards['1'].value)
      if (choice === 'between') {
        console.log(
          playerCards['0'].value < card.value &&
            card.value < playerCards['1'].value
        )
        isCorrect =
          playerCards['0'].value < card.value &&
          card.value < playerCards['1'].value
      } else {
        console.log('else')
        // console.log(playerCards['0'].value > card.value)
        // console.log(playerCards['1'].value < card.value)
        isCorrect =
          playerCards['0'].value > card.value ||
          playerCards['1'].value < card.value
      }
      break
    case 4:
      isCorrect = choice === card.suitName
      break
    case 5:
      isCorrect = choice === card.card
      break

    default:
      console.log('no round match')
      console.log('game', game)
  }
  if (isCorrect !== null) {
    if (isCorrect) {
      player.gameStats.drinksGiven += game.round * 2
      game.givingDrinks.push(player)
    } else {
      player.gameStats.drinksTaken += game.round * 2
    }
    player.cards.push(game.cards.splice(0, 1)['0'])
  }
  store.db.saveDatabase()
  return isCorrect
}

exports.playerJoin = function (gameSettings, user) {
  // let games = db.getCollection('games')
  // console.log(gameSettings)
  // console.log(user)
  // console.log(games)

  let game = games.findOne({
    roomId: gameSettings.gameid
    // pin: gameSettings.pin  //pin disabled for now
  })
  // console.log(game)
  if (game) {
    //TODO: Test here; avail slots, not already
    console.log(game.players.find((p) => p.id === user.id))
    if (!game.players.find((p) => p.id === user.id)) {
      this.playerAdd(game, user)
      this.gameLogAdd(
        game,
        this.gameLogFormat(user.id, null, 'Joined the game')
      )
    }

    console.log('end of player Join ------')
    // console.log(game)
    // console.log(games)
    store.db.saveDatabase()
    return game
    //delete extra here
    //emit player join
  } else {
    return false
  }
}
