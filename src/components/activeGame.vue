<script>
import io from 'socket.io-client'
import { mapGetters, mapState } from 'vuex'

import gameInfoBar from '@/components/gameInfoBar'
import logList from '@/components/logList'
import playersList from '@/components/playersList'
import statusCard from '@/components/statusCard'
export default {
  name: 'game',
  components: {
    gameInfoBar,
    logList,
    modalCard: () => import('@/components/modalCard'),
    modalDrinks: () => import('@/components/modalDrinks'),
    playersList,
    statusCard
  },
  props: {
    passedGameData: {
      type: Object,
      required: false,
      default: () => {}
    },
    isJoined: {
      type: Boolean,
      required: false,
      default: () => false
    }
  },
  data: () => ({
    // statusMessage: null,
    cardViewing: '',
    socket: null,
    turnTimer: 45
  }),
  computed: {
    ...mapGetters(['isHost', 'playerDataById']),
    ...mapState([
      'cardImgBack',
      'cardImgFaceBaseUrl',
      'choiceSelected',
      'gameData',
      'isLoading',
      'player',
      'turnTimeLeft'
    ]),
    modal() {
      return (
        this.gameData.givingDrinks['0'] &&
        this.gameData.givingDrinks['0'].id === this.player.id
      )
    },
    modalData() {
      let drinksCount = 0
      if (this.gameData.round <= 4) {
        drinksCount = this.gameData.round * 2
      } else {
        drinksCount =
          this.gameData.roundPhase % 2 === 0
            ? this.gameData.cardsRiver['take'].length * 2
            : this.gameData.cardsRiver['give'].length * 2
      }
      return {
        drinksCount: drinksCount
      }
    }
  },
  methods: {
    cardImg(card = null) {
      // console.log(card)
      return card
        ? `${this.cardImgFaceBaseUrl}/${card.card === '10' ? '0' : card.card}${
            card.suit
          }.png`
        : this.cardImgBack
    },
    async connectIO(data) {
      console.log(data)
      this.socket = io('http://localhost:3000')
      this.setStateValue({ key: 'isLoading', val: false })

      this.socket.emit('gameAction', { action: 'joined', user: this.player.id })
      this.socket.on('gameEvent', data => {
        console.log('on gameEvent')
        console.log(data)

        this.setTurnTimer(data.turnTimeLeft || 0)
        switch (data.event) {
          case 'choiceResult':
            this.onChoiceResult(data)
            break
          case 'drinksGiven':
            this.onDrinksGiven(data)
            break
          case 'ended':
            this.onEnded(data)
            break
          case 'joined':
            if (
              this.gameData.players.find(p => p.id === data.user.id) ===
              undefined
            ) {
              this.setStateValue({
                key: 'gameData',
                val: {
                  ...this.gameData,
                  players: [...this.gameData.players, data.user]
                }
              })
              this.setStateValue({
                key: 'gameData',
                val: {
                  ...this.gameData,
                  log: [...this.gameData.log, data.log]
                }
              })
            }
            break
          case 'riverIncrement':
            console.log('riverIncrement')
            console.log(data)
            this.setStateValue({
              key: 'gameData',
              val: {
                ...this.gameData,
                ...data.gameData
              }
            })
            console.log({ ...this.gameData })
            break
          case 'started':
            console.log('on started')
            console.log(data)
            this.setValues(data.gameData)
            this.setStateValue({
              key: 'gameData',
              val: {
                ...this.gameData,
                log: [...this.gameData.log, data.log]
              }
            })
            this.setStateValue({ key: 'choiceLoading', val: false })
            break

          case 'turnIncrement':
            console.log('turnIncrement')
            console.log(data)
            this.onTurnIncrement(data)

            break
          default:
            console.log('default io reached')
            console.log(data)
        }
      })
      this.socket.on('testResp', data => {
        console.log('testResp')
        console.log(data)
        // socket.emit('my other event', { my: 'data' })
      })
    },
    gameEnd() {
      console.log('end game')
      console.log(this.socket)
      this.socket.emit('gameAction', {
        action: 'end'
      })
    },
    gameLeave() {
      console.log('leave game')
      console.log(this.socket)
      this.socket.emit('gameAction', {
        action: 'leave'
      })
    },
    gameStart() {
      console.log('start game')
      console.log(this.socket)
      this.socket.emit('gameAction', {
        action: 'start'
      })
    },
    async initalizeGame(data) {
      console.log(data)
      this.setValues(data)
      setTimeout(() => this.connectIO(), 1500)
      // this.connectIO()
    },
    onChoiceResult({ result, player, log, givingDrinks, drinks }) {
      console.log(drinks)
      // this.setStateValue({ key: 'drinksGiven', val: drinks || [] })
      //const players, set gameData ...,
      console.log(player)
      const card = player.cards[this.gameData.round - 1]
      console.log(card)
      console.log(this.cardImg(card))
      const players = this.gameData.players
      const pindex = players.findIndex(p => p.id === player.id)
      players[pindex] = player
      this.setStateValue({
        key: 'deckImage',
        val: this.cardImg(card)
      })
      this.setStateValue({
        key: 'gameData',
        val: {
          ...this.gameData,
          drinksGiven: drinks || [],
          log: [...this.gameData.log, ...log],
          players: [...players]
        }
      })
      console.log(card)
      // this.setStateValue({ key: 'givingDrinks', val: givingDrinks || [] })
      // this.gameData.givingDrinks = givingDrinks || []
      if (result === true) {
        if (givingDrinks && givingDrinks['0'].id === this.player.id) {
          setTimeout(() => {
            this.setStateValue({
              key: 'gameData',
              val: { ...this.gameData, givingDrinks: givingDrinks }
            })
          }, 2000)
        } else {
          this.setStateValue({
            key: 'gameData',
            val: { ...this.gameData, givingDrinks: givingDrinks }
          })
        }

        // this.statusMessage = 'USER GUESSED X'
        console.log('give drinks')
        // if (player.id === this.player.id) {
        //   this.modalData.drinksCount = this.round * 2
        //   setTimeout(() => {
        //     this.modal = true
        //   }, 500)
        // }
      } else {
        // setTimeout(() => {
        //   this.choiceLoading = false
        //   console.log('incr turn')
        // }, 3000)
        // this.drinksTaken = drinks
        this.setStateValue({ key: 'choiceLoading', val: false })
        this.setStateValue({ key: 'choiceSelected', val: null })
      }
      return
    },
    onDrinksGiven(data) {
      console.log('On drinks given')
      console.log(data)

      //REPLACE this.Value with dispatch(setvalue)

      if (data.log.length > 0) {
        const players = this.gameData.players
        data.log.forEach(log => {
          let playerIndex = players.findIndex(p => p.id === log.targetPlayer)
          players[playerIndex].gameStats.drinksTaken += log.drinks
          this.setStateValue({
            key: 'gameData',
            val: { ...this.gameData, players: [...players] }
          })
          this.setStateValue({
            key: 'gameData',
            val: { ...this.gameData, log: [...this.gameData.log, log] }
          })
          if (log.targetPlayer === this.player.id) {
            console.log('Show Alert DRINK X')
          }
        })
      }

      this.setStateValue({
        key: 'gameData',
        val: { ...this.gameData, drinksGiven: data.drinks || [] }
      })

      this.setStateValue({
        key: 'gameData',
        val: { ...this.gameData, givingDrinks: data.givingDrinks || [] }
      })
    },
    onEnded(data) {
      console.log('on ended', data)
      this.setStateValue({
        key: 'gameData',
        val: {
          ...this.gameData,
          ...data.gameData,
          log: [...this.gameData.log, ...data.log]
        }
      })
      this.setStateValue({
        key: 'player',
        val: { ...this.player, activeGame: '' }
      })
    },
    onSubmit() {
      this.setStateValue({ key: 'choiceLoading', val: true })
      if (!this.choiceSelected && this.isHost) {
        this.gameStart()
      } else {
        this.socket.emit('gameAction', {
          action: 'choice',
          value: this.choiceSelected.value
        })
      }
    },
    onSubmitAction() {
      if (this.gameData.state === 'pending') {
        this.gameStart()
      }

      if (this.gameData.state === 'active' && this.gameData.round < 5) {
        this.onSubmit()
      }
    },
    onSubmitDrinks(players) {
      // this.modal = false
      this.setStateValue({ key: 'choiceLoading', val: false })
      this.setStateValue({ key: 'choiceSelected', val: null })
      const drinksGiven = []
      if (players && players.length > 0) {
        players.forEach(p =>
          drinksGiven.push({ player: p.id, drinks: p.drinks })
        )
      }
      console.log(players)
      this.socket.emit('gameAction', {
        action: 'drinksGive',
        data: drinksGiven
      })
    },
    onTurnIncrement(data) {
      console.log(data)
      console.log(this.gameData.cardsRiver)
      this.setStateValue({
        key: 'gameData',
        val: { ...this.gameData, drinksGiven: [], givingDrinks: [] }
      })

      if (data.gameData.riverCard) {
        const action = data.gameData.roundPhase % 2 === 0 ? 'take' : 'give'
        console.log(action)
        // this.cardsRiver[action].push(data.gameData.riverCard)
        const cardsRiver = { ...this.gameData.cardsRiver }
        cardsRiver[action].push(data.gameData.riverCard)

        this.setStateValue({
          key: 'gameData',
          val: { ...this.gameData, cardsRiver: cardsRiver }
        })

        // playersAction = this.playersAction(data.gameData.roundPhase)
      }
      console.log(this.gameData.cardsRiver)
      this.setStateValue({
        key: 'gameData',
        val: { ...this.gameData, ...data.gameData }
      })
      this.setStateValue({ key: 'deckImage', val: this.cardImgBack })
    },
    onModalSubmit(data) {
      console.log(data)
    },
    onViewCard(card) {
      this.cardViewing = card
    },
    setTurnTimer(time) {
      if (typeof time === 'number' && time > 0) {
        this.setStateValue({ key: 'turnTimeLeft', val: time })
        const int = setInterval(
          () =>
            this.turnTimeLeft >= 100
              ? this.setStateValue({
                  key: 'turnTimeLeft',
                  val: this.turnTimeLeft - 100
                })
              : clearInterval(int),
          100
        )
      } else {
        this.setStateValue({ key: 'turnTimeLeft', val: 0 })
      }
    },
    setStateValue(data) {
      this.$store.dispatch('setStateByKey', {
        key: data.key,
        val: data.val
      })
    },
    setValues(data) {
      console.log(data)
      console.log(this.gameData)
      Object.keys(data).forEach(k => {
        if (typeof this.gameData[k] !== undefined) {
          this.setStateValue({
            key: 'gameData',
            val: { ...this.gameData, [k]: data[k] }
          })
        }
      })
    }
  },
  async created() {
    if (this.passedGameData) {
      // console.log('from prop: ', this.gameData)
      await this.initalizeGame(this.passedGameData)
    } else {
      await this.$store
        .dispatch('apiCall', { endpoint: '/game/active' })
        .then(resp => {
          // console.log('from get Data: ', resp)
          if (resp.status === 'error') {
            //PUSH ROUTE LANDING, Set Error Message
            this.$router.push({
              name: 'landing',
              params: { incomingMessage: resp }
            })
          } else {
            this.initalizeGame(resp.data)
          }
        })
    }
  },
  mounted() {
    console.log('active game mounted')
    // this.modalData.drinksCount = 2
    // setTimeout(() => {
    //   this.modal = true
    // }, 500)
  }
}
</script>
<template>
  <div class="uk-flex uk-flex-column  uk-width-expand">
    <!--
    <gameInfoBar
      @endGameAction="isHost ? gameEnd() : gameLeave()"
    ></gameInfoBar>
    -->
    <div class="uk-flex uk-flex-around">
      <div class="uk-width-1-2">
        <statusCard @submitAction="onSubmitAction"></statusCard>
        <logList v-if="!isLoading"></logList>
      </div>
      <div class=" uk-width-1-2 playersCol  uk-flex uk-flex-center">
        <playersList @viewCard="onViewCard"></playersList>
      </div>
    </div>
    <modalDrinks
      v-if="modal"
      :players="gameData.players"
      v-bind="modalData"
      :key="modal"
      @submitDrinks="onSubmitDrinks"
    ></modalDrinks>
    <modalCard
      v-if="cardViewing"
      :src="cardViewing"
      :key="cardViewing"
      @closeModal="cardViewing = ''"
    ></modalCard>
  </div>
</template>

<style scoped>
.playersCol {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

.statusCard {
  flex-grow: 1;
  height: 22em;
}

.logCol {
  margin-top: 20px;
}
</style>
