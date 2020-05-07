<template>
  <div class="uk-flex uk-flex-column uk-flex-middle uk-height-1-1">
    <h2 class="uk-text-secondary">
      UP THE RIVER, DOWN THE RIVER
    </h2>
    <transition name="fadeInLeftBig">
      <div
        :key="action"
        class="uk-section  uk-preserve-color uk-background-cover uk-padding-remove-vertical"
        style="background-image: url(http://localhost:3000/images/beer_animated.gif)"
      >
        <div class="uk-container ">
          <form
            class="uk-form-stacked uk-padding-large  uk-flex uk-flex-column uk-flex-middle uk-flex-around"
          >
            <div class="uk-margin">
              <label
                class="uk-form-label uk-text-bold uk-align-left"
                for="userName"
                >NAME</label
              >
              <div class="uk-form-controls">
                <div class="uk-inline">
                  <span class="uk-form-icon">
                    <account></account>
                  </span>
                  <input
                    v-model="playerName"
                    type="text"
                    name="userName"
                    placeholder="Your Name"
                    class="uk-input uk-form-width-large"
                  />
                </div>
              </div>
            </div>

            <div class="uk-margin" v-if="action === 'join'">
              <label
                class="uk-form-label uk-text-bold uk-align-left"
                for="gameId"
                >GAME ID</label
              >
              <div class="uk-form-controls">
                <div class="uk-inline">
                  <span class="uk-form-icon">
                    <key></key>
                  </span>
                  <input
                    v-model="gameSettings.gameid"
                    type="text"
                    name="gameId"
                    class="uk-input uk-form-width-large"
                  />
                </div>
              </div>
            </div>
            <div class="uk-margin" v-else>
              <label
                class="uk-form-label uk-text-bold uk-align-left"
                for="gamePin"
                >MAX PLAYERS</label
              >
              <div class="uk-form-controls">
                <div class="uk-inline">
                  <span class="uk-form-icon">
                    <lock></lock>
                  </span>
                  <input
                    v-model="gameSettings.playersCount"
                    type="number"
                    min="2"
                    max="8"
                    name="password"
                    placeholder="Max players"
                    class="uk-input uk-form-width-large"
                  />
                </div>
              </div>
            </div>

            <!--
          <div class="uk-margin">
            <label
              class="uk-form-label uk-text-bold uk-align-left"
              for="gamePin"
              >PIN</label
            >
            <div class="uk-form-controls">
              <div class="uk-inline">
                <span class="uk-form-icon">
                  <lock></lock>
                </span>
                <input
                  v-model="gameSettings.pin"
                  type="text"
                  name="gamePin"
                  class="uk-input uk-form-width-large"
                />
              </div>
            </div>
          </div>
          -->
            <div
              class="uk-button  uk-button-primary uk-width-1-1 uk-margin-large uk-margin-remove-bottom btnJoin"
              @click="actionSubmit"
            >
              <span
                :uk-icon="
                  `icon:  ${
                    action === 'join' ? button.join.icon : button.create.icon
                  }; `
                "
              ></span>
              {{ action === 'join' ? button.join.text : button.create.text }}
            </div>
          </form>
        </div>
      </div>
    </transition>

    <button
      class="uk-button  uk-button-primary uk-width-1-1 uk-margin-large uk-margin-remove-bottom btnStart"
      @click="actionToggle"
    >
      <span
        :uk-icon="
          `icon:  ${
            action === 'join' ? button.create.icon : button.join.icon
          }; `
        "
      ></span>
      {{ action === 'join' ? button.create.text : button.join.text }}
    </button>

    <div
      class="message"
      :class="message.status"
      v-if="message && message.message"
    >
      {{ message.message }}
    </div>
  </div>
</template>
<script>
import account from 'vue-material-design-icons/Account.vue'
import key from 'vue-material-design-icons/Key.vue'
import lock from 'vue-material-design-icons/Lock.vue'
export default {
  name: 'landingPage',
  components: {
    account,
    key,
    lock
  },
  props: {
    incomingMessage: {
      type: Object,
      required: false,
      default: () => null
    }
  },
  data: () => ({
    action: 'join', //create || join
    activeGame: null,
    button: {
      create: {
        icon: 'copy',
        text: 'START NEW'
      },
      join: {
        icon: 'sign-in',
        text: 'JOIN'
      }
    },
    gameSettings: {
      gameid: '111-111-111',
      playersCount: 6
    },
    message: {
      message: null,
      status: null
    }
  }),
  computed: {
    // messageData: {
    //   get() {
    //     return this.$store.state.messageData
    //   },
    //   set(v) {
    //     this.$store.dispatch('setStateValue', {
    //       key: 'messageData',
    //       val: v
    //     })
    //   }
    // },
    playerName: {
      get() {
        return this.$store.state.player.name
      },
      set(v) {
        const name = v.toUpperCase()
        if (name.length > 20) {
          this.message = {
            status: 'error',
            message: 'Player name 20 characters max.'
          }
          this.playerName = name.substr(0, 20)
        } else {
          this.$store.dispatch('setStateByKey', {
            key: 'player',
            val: { ...this.$store.state.player, name: name }
          })
          localStorage.setItem('playerName', name)
        }
      }
    }
  },
  methods: {
    actionSubmit() {
      if (this.action === 'join') {
        this.joinGame()
      } else {
        this.submitNew()
      }
    },
    actionToggle() {
      this.messageSet()
      this.action = this.action === 'join' ? 'create' : 'join'
    },
    createNewGame(gameData) {
      console.log(gameData)
      console.log('createGame')
      localStorage.setItem('playerName', this.playerName)
      this.$router.push({
        name: 'activeGame',
        params: { passedGameData: gameData }
      })
    },
    joinGame() {
      console.log('join game')
      if (!this.gameSettings.gameid || !this.gameSettings.pin) {
        this.message.message = 'Both Game ID and Pin are required.'
        this.message.status = 'error'
      } else {
        this.$store
          .dispatch('apiCall', {
            endpoint: '/game/join',
            postData: { ...this.gameSettings, playerName: this.playerName }
          })
          .then(resp => {
            console.log(resp)
            if (resp.status === 'success') {
              this.$router.push({
                name: 'activeGame',
                params: { passedGameData: resp.data }
              })
            }
            if (resp.status === 'error') {
              this.message = resp
            }
          })
      }
    },
    messageSet(text = null, status = null) {
      this.message = {
        message: text,
        status: status
      }
    },
    submitNew() {
      this.submitLoading = true
      setTimeout(() => {
        this.submitLoading = false
      }, 2000)

      console.log(this.gameSettings.playersCount)
      if (
        this.gameSettings.playersCount < 2 ||
        this.gameSettings.playersCount > 8
      ) {
        this.message = 'Players allowed 2 - 8'
        console.log('return')
        return
      }
      this.$store
        .dispatch('apiCall', {
          endpoint: '/game/create',
          postData: { ...this.gameSettings, playerName: this.playerName }
        })
        .then(resp => {
          if (resp.status === 'success') {
            this.createNewGame(resp.data)
          }
        })
        .catch(error => {
          console.error('Error:', error)
        })
    }
  },
  created() {
    this.playerName = localStorage.getItem('playerName') || ''
    //TODO: setup active game detection at landing/create
    if (this.incomingMessage) {
      this.message = this.incomingMessage
    }
    // this.$store.dispatch('getSession').then(resp => {
    //   console.log(resp)
    //   if (resp) {
    //     console.log(resp.data)
    //     if (resp.data && resp.data.activeGame) {
    //       console.log(resp.data.activeGame)
    //       this.$router.push({
    //         name: 'activeGame'
    //       })
    //     }
    //   }
    // })
  }
}
</script>
<style scoped>
/* body {
  background-color: #dadada;
}

 */

.btnJoin {
  border-color: white;
  border-style: solid;
}

.btnStart {
  border-color: white;
  border-style: solid;
}

.formSegment {
  background: url('http://localhost:3000/images/beer_animated.gif');
  background-size: cover;
  height: 300px;
  padding: 50px;
  border-top: 0px;
  border-radius: 10px;
}

.nameField {
  padding-bottom: 20px;
}
</style>
