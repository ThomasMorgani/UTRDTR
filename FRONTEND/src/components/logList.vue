<script>
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'logList',
  computed: {
    ...mapGetters(['playerDataById']),
    ...mapState(['gameData']),
    logData() {
      return [...this.gameData.log].sort((a, b) => b.timestamp - a.timestamp)
    }
  }
}
</script>
<template>
  <div class="uk-card ">
    <transition-group
      name="slideInDown"
      leave-active-class=""
      tag="div"
      class="logList"
    >
      <div
        class="uk-card uk-flex uk-flex-start uk-margin-bottom"
        v-for="(log, i) in logData"
        :key="log.timestamp + '' + i"
      >
        <img
          class="playerAvatar"
          src="http://localhost:3000/images/default_avatar.png"
        />
        <div class="uk-flex uk-flex-column uk-flex-start logContent">
          <a class="uk-text-bold ">{{
            log.sourcePlayer ? playerDataById[log.sourcePlayer].name : ''
          }}</a>
          <div class="description">
            <span>{{ log.text }}</span>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>
<style>
.logList {
  min-height: 4em;
  max-height: calc(100vh - 35em);
  overflow-y: auto;
  background-color: white;
  padding: 10px;
}

.playerAvatar {
  height: 1.5em;
  margin-right: 1em;
}

.logContent {
  line-height: 1em;
}
</style>
