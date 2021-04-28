import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cardImgBack: 'http://localhost:3000/images/card_back1.jpg', //AS.png, 5C.png etc
    cardImgFaceBaseUrl: 'https://deckofcardsapi.com/static/img', //AS.png, 5C.png etc
    choiceLoading: false,
    choiceSelected: null,
    deckImage: 'http://localhost:3000/images/card_back1.jpg',
    gameData: {
      activePlayer: null,
      cardsRiver: {
        give: [],
        take: []
      },
      drinksGiven: [],
      givingDrinks: [],
      host: '',
      id: null,
      isActive: false,
      log: [],

      pin: null,
      players: [],
      playersCount: 8,
      roomId: null,
      roomName: '',
      round: 0,
      roundPhase: 1,
      state: 'pending'
    },
    isLoading: true,
    messageData: {
      status: '',
      message: '',
      data: null
    },
    player: {
      id: null,
      name: null,
      statistics: {
        given: 0,
        taken: 0
      }
    },
    settings: {
      screenx: 0,
      screeny: 0,
      isMobile: false
    },
    turnTimeLeft: 0
  },
  getters: {
    isHost(state) {
      return state.player.id === state.gameData.host
    },
    playerDataById(state) {
      let players = {}
      if (state.gameData && state.gameData.players.length > 0) {
        state.gameData.players.forEach(p => {
          if (p.id) {
            players[p.id] = p
          }
        })
      }
      return players
    }
  },
  mutations: {
    SET_KEY_VAL(state, data) {
      state[data.key] = data.val
    },
    TOGGLE_ITEM(state, data) {
      state[data.item] = !state[data.item]
    }
  },
  actions: {
    apiCall(context, data) {
      const url = Vue.prototype.$appConfig.baseUrl + data.endpoint
      return fetch(url, {
        method: data.postData ? 'POST' : 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'include', // include, *same-origin, omit
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: data.postData ? JSON.stringify(data.postData) : null // body data type must match "Content-Type" header
      }).then(response => response.json())
    },
    getSession({ dispatch }) {
      return new Promise((resolve, reject) => {
        dispatch('apiCall', { endpoint: '/user/session' })
          .then(res => {
            console.log(res)
            if (res && res.status === 'success') {
              dispatch('setStateByKey', {
                key: 'player',
                val: { ...res.data }
              })
              resolve(res)
            }
          })
          .catch(err => reject(err))
      })
    },
    setStateByKey({ commit }, data) {
      commit('SET_KEY_VAL', data)
      return true
    },
    toggle({ commit }, data) {
      commit('TOGGLE_ITEM', data)
      return true
    }
  }
})
