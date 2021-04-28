<template>
  <div class="uk-width-1-1 uk-width-expand mainRow">
    <div class="card gameRow">
      <h3>ROOM NAME</h3>
      <div v-if="isLoading">loading..</div>
      <div v-else @click="showExtended = !showExtended" class="toggleGameInfo">
        <i class="icon info"></i
        ><i class="icon" :class="showExtended ? 'angle up' : 'angle down'"></i>
      </div>
    </div>
    <transition name="slideInDown" mode="out-in">
      <div class="card gameInfoRow" v-if="showExtended">
        <div>
          <div class="ui list">
            <div class="item">
              <div class="header">ROOM ID:</div>
              {{ gameData.roomId }}
            </div>
            <div class="item">
              <div class="header">ROOM PIN:</div>
              {{ gameData.pin }}
            </div>
            <div class="item">
              <div class="header">DEALER:</div>
              {{ playerDataById[gameData.host].name }}
            </div>
          </div>
        </div>
        <div class="rightCol">
          <div style="font-weight: bold;">
            <i
              class="user circle large icon"
              style="margin: 0px 5px 0px 0px"
            ></i>
            <span style="font-size: 1.2em;">{{ player.name }}</span>
          </div>
          <button
            @click="$emit('endGameAction')"
            class="ui small button bgPrimary gameButton"
          >
            <i class="sign-out icon"></i>
            {{ isHost ? 'END GAME' : 'LEAVE GAME' }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'gameInfoBar',
  data: () => ({ showExtended: false }),
  computed: {
    ...mapGetters(['isHost', 'playerDataById']),
    ...mapState(['gameData', 'isLoading', 'player'])
  },
  methods: {
    endGame() {
      console.log('end')
      this.$emit('endGameAction')
    }
  }
}
</script>
<style>
h3 {
  margin-bottom: 0px;
}
.mainRow {
  padding: 0px !important;
}
.gameRow {
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: #fff;
  color: #2b2351;
  font-weight: bold;
  z-index: 10;
}

.gameRow .toggleGameInfo :hover {
  cursor: pointer;
}

.gameButton {
  position: relative;
  flex-grow: 0;
  flex-shrink: 1;
}

.gameInfoRow {
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-between;
  width: 100%;
  background-color: #fff;
  color: #2b2351;
  z-index: 9;
}

.rightCol {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
