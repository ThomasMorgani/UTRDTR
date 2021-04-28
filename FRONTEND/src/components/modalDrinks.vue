<template>
  <div id="modal-sections" class="uk-modal uk-open" style="display: unset;">
    <div class="uk-modal-dialog">
      <div class="uk-modal-header">
        <h2 class="uk-modal-title uk-text-primary">GIVE DRINKS</h2>
      </div>
      <div
        class="uk-modal-body uk-padding-remove-bottom uk-flex uk-flex-column uk-flex-between"
      >
        <!-- CREATE ITEM COMPS FOR EACH STYLE LOG -->
        <ul class="uk-list uk-list uk-list-divider playersList">
          <li
            class="uk-flex uk-flex-between playerItem"
            v-for="(player, i) in playersData"
            :key="i"
          >
            <div class="uk-flex uk-flex-column uk-flex-1">
              <span class=" playerName ">{{ player.name }}</span>
              <div class="description">
                ({{
                  `G:${player.gameStats.drinksGiven} / T:${player.gameStats.drinksTaken}`
                }})
              </div>
            </div>
            <div class="playerDrinksContent">
              <span
                uk-icon="chevron-down"
                :class="{
                  disabled: player.drinks < 1,
                  link: player.drinks > 0
                }"
                @click="drinkMinus(player.id)"
              ></span>

              <span class="playerDrinkCountText">{{ player.drinks }}</span>
              <span
                uk-icon="chevron-up"
                :class="{
                  disabled: drinksLeft < 1,
                  link: drinksLeft > 0
                }"
                @click="drinkAdd(player.id)"
              ></span>
            </div>
          </li>
        </ul>
        <h3>
          DRINKS GIVEN: {{ `${drinksCount - drinksLeft}/${drinksCount}` }}
        </h3>
      </div>
      <div class="uk-modal-footer uk-text-right">
        <button
          class="uk-button uk-button-primary"
          :disabled="drinksLeft > 0"
          type="button"
          @click="submit"
        >
          SEND EM
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'drinkModal',
  props: {
    drinksCount: {
      required: true,
      type: Number
    },
    players: {
      required: true,
      type: Array
    }
  },
  data: () => ({
    drinksLeft: 0,
    playersData: {}
  }),
  components: {
    ...mapGetters(['playerDataById']),
    ...mapState(['gameData', 'player', 'turnTimeLeft'])
  },
  methods: {
    drinkMinus(player) {
      if (this.playersData[player].drinks < 1) {
        return
      }
      this.drinksLeft++
      this.playersData[player].drinks--
    },
    drinkAdd(player) {
      if (this.drinksLeft < 1) {
        return
      }
      this.drinksLeft--
      this.playersData[player].drinks++
    },
    submit() {
      if (this.drinksLeft > 0) {
        return
      }
      const players = []
      Object.values(this.playersData).forEach(p => {
        if (p.drinks > 0) {
          players.push(p)
        }
      })
      this.$emit('submitDrinks', players)
    }
  },
  mounted() {
    this.players.forEach(p => {
      this.$set(this.playersData, p.id, { ...p, drinks: 0 })
    })
    this.drinksLeft = this.drinksCount
  }
}
</script>
<style scoped>
.uk-modal-body {
  min-height: 300px;
}
.description {
  font-size: 0.75em;
}

.playerItem {
  width: 100%;
}

.playerName {
  font-weight: bold;
  font-size: 2em;
  color: #2b2351;
}

.playerDrinksContent {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
}

.playerDrinkCountText {
  margin: 0px 20px;
  font-weight: bold;
  font-size: 2.2em;
  color: #2b2351;
}

.playerDrinkIcons {
  margin-left: 10px;
}

.sendDrinksBtn {
  background-color: #32d296;
  color: #fff;
}
</style>
