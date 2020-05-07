<template>
  <div class="uk-flex uk-flex-column uk-flex-middle">
    <h2 class="uk-text-primary">
      NEW GAME
    </h2>

    <div
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

          <div class="uk-margin">
            <label class="uk-form-label uk-text-bold uk-align-left" for="gameId"
              >GAME ID</label
            >
            <div class="uk-form-controls">
              <div class="uk-inline">
                <span class="uk-form-icon">
                  <key></key>
                </span>

                <input
                  v-model="gameSettings.roomName"
                  type="text"
                  name="roomName"
                  placeholder="Room Name"
                  class="uk-input uk-form-width-large"
                />
              </div>
            </div>
          </div>

          <div class="uk-margin">
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
          -->

          <div
            class="uk-button  uk-button-primary uk-width-1-1 uk-margin-large uk-margin-remove-bottom btnStart"
            :class="{ loading: submitLoading }"
            @click="submitNew"
          >
            CREATE
          </div>
        </form>
      </div>
    </div>

    <router-link
      class="uk-button  uk-button-primary uk-width-1-1 uk-margin-large uk-margin-remove-bottom btnStart"
      to="/"
    >
      <span uk-icon="icon:  arrow-left; ratio: 1.5"></span> JOIN
    </router-link>

    <div class=" message" :class="message.status" v-if="message">
      {{ message.message }}
    </div>
  </div>
</template>

<script>
import account from 'vue-material-design-icons/Account.vue'
import key from 'vue-material-design-icons/Key.vue'
import lock from 'vue-material-design-icons/Lock.vue'
export default {
  name: 'newGame',
  components: {
    account,
    key,
    lock
  },
  data: () => ({
    gameSettings: {
      pin: 1111,
      playersCount: 6,
      roomName: null
    },
    message: '',
    submitLoading: false
  }),
  computed: {
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
    createNewGame(gameData) {
      console.log(gameData)
      console.log('createGame')
      localStorage.setItem('playerName', this.playerName)
      this.$router.push({
        name: 'activeGame',
        params: { passedGameData: gameData }
      })
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
.image {
  margin-top: -100px;
}
.column {
  max-width: 450px;
}

.col1 {
  margin-top: 100px;
}

.nameField {
  padding-bottom: 20px;
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
</style>
