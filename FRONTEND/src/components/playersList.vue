<template>
  <div v-if="!isLoading" class="playerList" :style="dynamicStyles.playerList">
    <div
      class="uk-card uk-flex uk-flex-column uk-margin-small-top playerItem"
      v-for="player in gameData.players"
      :key="player.id"
    >
      <!-- <img
                src="http://localhost:3000/images/default_avatar.png"
                class=" ui avatar image playerImage"
              /> -->
      <div
        class="playerDetails uk-width-1-1 uk-flex uk-flex-between uk-flex-end"
      >
        <div>
          <transition name="heartBeat" appear>
            <!-- <a v-if="1 === 1"> -->
            <a
              v-if="gameData.drinksGiven && hasDrinks(player)"
              class="uk-animation-shake"
            >
              <glassMug class="icon-big primary uk-animation-shake"></glassMug>
              X{{ hasDrinks(player) }}
            </a>

            <span
              v-else-if="player.id === gameData.activePlayer"
              uk-icon="triangle-right"
              class="uk-text-primary uk-animation-slide-left"
            ></span>
          </transition>
          <a
            class="playerName uk-text-primary"
            :class="player.isEmpty ? 'fontDisabled' : 'fontPrimary'"
          >
            {{ player.name }}</a
          >
        </div>
        <span class="statsText"
          >({{
            `G:${player.gameStats.drinksGiven} / T:${player.gameStats.drinksTaken}`
          }})</span
        >
      </div>
      <div class="  playerContentCard">
        <img
          class=" playerCardImg uk-margin-small-right"
          :style="dynamicStyles.cardImg"
          v-for="(n, index) in 4"
          :key="n"
          :src="
            player.cards[index]
              ? cardImg(player.cards[index])
              : 'http://localhost:3000/images/card_back1.jpg'
          "
          @click="
            $emit(
              'viewCard',
              player.cards[index] ? cardImg(player.cards[index]) : null
            )
          "
        />
      </div>
    </div>
    <template v-if="gameData.state === 'pending'">
      <div
        class="uk-margin-small-top playerItem"
        v-for="n in gameData.playersCount - gameData.players.length"
        :key="'emptyPlayer' + n"
      >
        <!-- <a class="ui mini image ">
                  <img
                    src="http://localhost:3000/images/default_avatar.png"
                    class="playerImage"
                  />
                </a> -->
        <div class="content">
          <a class="uk-text-lead fontDisabled">Empy Slot {{ n }}</a>
          <div class="ui images playerContentCard">
            <img
              class="uk-margin-small-right playerCardImg"
              :style="dynamicStyles.cardImg"
              v-for="n in 4"
              :key="n"
              :src="cardImgBack"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import glassMug from 'vue-material-design-icons/GlassMugVariant.vue'
export default {
  name: 'playerList',
  data: () => ({
    defaultPlayer: {
      avatar: null,
      cards: [],
      id: null,
      isEmpty: true,
      name: 'Empty'
    }
  }),
  components: { glassMug },
  computed: {
    ...mapState([
      'cardImgBack',
      'cardImgFaceBaseUrl',
      'gameData',
      'isLoading',
      'settings'
    ]),
    dynamicStyles() {
      const isMobile = this.settings.isMobile
      //list height 100vh - nav - statusCard - tabs
      // const statusCardHeight = isMobile ? ''
      const styles = {
        cardImg: {
          height: isMobile ? '5em' : '4.2em'
        },
        playerList: {
          'max-height': isMobile ? 'calc(100vh - 28em)' : 'calc(100vh - 5em)',
          'margin-left': isMobile ? null : '1em'
        }
      }
      return styles
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
    hasDrinks(player) {
      const drinks = this.gameData.drinksGiven.find(d => d.player === player.id)
      return drinks ? drinks.drinks : false
    }
  }
}
</script>
<style>
.playerList {
  min-height: 10em;

  overflow-y: auto;
  background-color: white;
  padding: 10px;
}
.playerImage {
  align-self: center;
  width: 35px;
  height: 35px;
  font-size: 0.78571429rem;
  max-width: 35px !important;
  max-height: 35px !important;
}

.playerContentCard img {
  /* height: 4.2em; */
}

.playerName {
  font-size: 1.2em;
  line-height: 1.5;
  font-weight: 600;
}

.statsText {
  padding: 5px;
  font-weight: bold;
  font-size: 0.85em;
}
</style>
