<script>
import { mapGetters, mapState } from 'vuex'

//ICONS
import alphaBCircle from 'vue-material-design-icons/AlphaBCircleOutline.vue'
import alphaRCircle from 'vue-material-design-icons/AlphaRCircleOutline.vue'
import arrowIn from 'vue-material-design-icons/ArrowExpandHorizontal.vue'
// import arrowIn from 'vue-material-design-icons/ArrowCollapseHorizontal.vue'
import arrowOut from 'vue-material-design-icons/ArrowSplitVertical.vue'
import arrowDown from 'vue-material-design-icons/ArrowDownBold.vue'
import arrowUp from 'vue-material-design-icons/ArrowUpBold.vue'
import cardsClub from 'vue-material-design-icons/CardsClub.vue'
import cardsDiamond from 'vue-material-design-icons/CardsDiamond.vue'
import cardsHeart from 'vue-material-design-icons/CardsHeart.vue'
import cardsSpade from 'vue-material-design-icons/CardsSpade.vue'
import checkboxBlankCircle from 'vue-material-design-icons/CheckboxBlankCircle.vue'
import plus from 'vue-material-design-icons/Plus.vue'
import glassMug from 'vue-material-design-icons/GlassMugVariant.vue'

export default {
  name: 'statusCard',
  components: {
    alphaBCircle,
    alphaRCircle,
    arrowDown,
    arrowIn,
    arrowOut,
    arrowUp,
    cardsClub,
    cardsDiamond,
    cardsHeart,
    checkboxBlankCircle,
    cardsSpade,
    glassMug,
    plus
  },
  computed: {
    ...mapGetters(['isHost', 'playerDataById']),
    ...mapState([
      'cardImgBack',
      'cardImgFaceBaseUrl',
      'choiceLoading',
      'choiceSelected',
      'deckImage',
      'drinksGiven',
      'gameData',
      'isLoading',
      'player',
      'settings',
      'turnTimeLeft'
    ]),
    btnSubmit() {
      const choice = this.choiceSelected
      //defualt btn state
      const btn = {
        show: this.player.id === this.gameData.activePlayer,
        class: `uk-button-${
          choice && choice.color ? [choice.color] : 'primary'
        }`,
        isDisabled: !choice || !choice.value,
        isloading: this.choiceLoading,
        text:
          choice && choice.value
            ? `SUBMIT ${
                choice.value ? choice.value.toUpperCase() : 'SELECT CHOICE'
              }`
            : 'SELECT CHOICE',
        icon: choice && choice.icon ? choice.icon : null
      }

      //pregame
      if (this.gameData.state === 'pending' && this.isHost) {
        btn.show = true
        // btn.class = { bgPrimary: !this.isLoading, disabled: this.isLoading }
        btn.isDisabled = false
        btn.text = 'START GAME'
        btn.icon = 'plus'
      }

      //when to hide btn
      if (
        this.isLoading ||
        this.gameData.drinksGiven.length > 0 ||
        (this.gameData.givingDrinks['0'] &&
          this.gameData.givingDrinks['0'].id === this.player.id) ||
        this.gameData.round > 4
      ) {
        btn.show = false
      }

      return btn
    },
    choiceBtns() {
      let choices = []
      if (this.gameData.state === 'active') {
        switch (this.gameData.round) {
          case 1:
            choices = [
              {
                color: 'black',
                value: 'black',
                icon: 'alphaBCircle',
                iconClass: {
                  'icon-big': true
                },
                class: {
                  'uk-button-large': true,
                  'uk-button-text': true,
                  'uk-text-black': true
                },
                selectedClass: {
                  'uk-button-black': true
                },
                tooltipText: 'BLACK'
              },
              {
                color: 'red',
                value: 'red',
                icon: 'alphaRCircle',
                iconClass: {
                  'icon-big': true
                },
                class: {
                  'uk-button-text': true,
                  'uk-text-danger': true
                },
                selectedClass: {
                  'uk-button-danger': true
                },
                tooltipText: 'RED'
              }
            ]
            break
          case 2:
            choices = [
              {
                color: '',
                value: 'higher',
                icon: 'arrowUp',
                class: {
                  'uk-button-text': true
                },
                selectedClass: {
                  'uk-button-primary': true
                },
                tooltipText: 'HIGHER'
              },
              {
                color: '',
                value: 'lower',
                icon: 'arrowDown',
                class: {
                  'uk-button-text': true
                },
                selectedClass: {
                  'uk-button-primary': true
                },
                tooltipText: 'LOWER'
              }
            ]
            break
          case 3:
            choices = [
              {
                color: '',
                value: 'between',
                icon: 'arrowIn',
                iconClass: {
                  'icon-big': true
                },
                class: {
                  'uk-button-text': true
                },
                selectedClass: {
                  'uk-button-primary': true
                },
                tooltipText: 'BETWEEN'
              },
              {
                color: '',
                value: 'outside',
                icon: 'arrowOut',
                iconClass: {
                  'icon-big': true
                },
                class: {
                  'uk-button-text': true
                },
                selectedClass: {
                  'uk-button-primary': true
                },
                tooltipText: 'OUTSIDE'
              }
            ]
            break

          case 4:
            choices = [
              {
                color: 'black',
                value: 'clubs',
                icon: 'cardsClub',
                iconColor: 'white',
                class: {
                  'uk-button-text': true
                },
                selectedClass: {
                  'uk-button-black': true
                },
                tooltipText: 'CLUBS'
              },
              {
                color: 'red',
                value: 'diamonds',
                icon: 'cardsDiamond',
                class: {
                  'uk-button-text': true,
                  'uk-text-danger': true
                },
                selectedClass: {
                  'uk-button-danger': true
                },
                tooltipText: 'DIAMONDS'
              },
              {
                color: 'red',
                value: 'hearts',
                icon: 'cardsHeart',
                iconColor: 'white',
                iconColorSelected: 'red',
                class: {
                  'uk-button-text': true,
                  'uk-text-danger': true
                },
                selectedClass: {
                  'uk-button-danger': true
                },
                tooltipText: 'HEARTS'
              },
              {
                color: 'black',
                value: 'spades',
                icon: 'cardsSpade',
                iconColor: 'white',
                iconColorSelected: 'black',
                class: {
                  'uk-button-text': true
                },
                selectedClass: {
                  'uk-button-black': true
                },
                tooltipText: 'SPADES'
              }
            ]
            break
        }
      }
      return choices
    },
    dynamicStyles() {
      const isMobile = this.settings.isMobile
      const styles = {
        deckImg: {
          height: isMobile ? '100px' : '100px'
        },
        statusCard: {
          padding: isMobile ? '.75em' : '3em'
        },
        statusTitle: {
          'font-size': isMobile ? '1em' : '2em'
        }
      }
      return styles
    },
    gameStatus() {
      let statusData = {}
      console.log({ ...this.gameData })
      console.log(this.gameData.round)
      switch (this.gameData.round) {
        case 1:
          if (this.gameData.state === 'pending') {
            statusData.title = 'PRE GAME'
            statusData.text = this.isHost
              ? 'Click Start When ready'
              : 'Awaiting Host'
          } else {
            statusData.title = 'ROUND 1: COLOR'
            statusData.text = ` BLACK OR RED?`
          }
          break
        case 2:
          console.log()
          console.log()
          statusData.title = 'ROUND 2: HIGHER/LOWER'
          statusData.text = `HIGHER OR LOWER THAN ${
            this.playerDataById[this.gameData.activePlayer].cards['0'].card
          }?`

          break
        case 3:
          statusData.title = 'ROUND 3: BETWEEN/OUTSIDE'
          statusData.text = `BETWEEN OR OUTSIDE OF  ${
            this.playerDataById[this.gameData.activePlayer].cards['0'].card
          } and ${
            this.playerDataById[this.gameData.activePlayer].cards['1'].card
          }? `

          break
        case 4:
          statusData.title = 'ROUND 4: SUIT'
          statusData.text = `PICK A SUIT`

          break
        case 5:
          statusData.title = 'UP THE RIVER DOWN THE RIVER'
          if (this.gameData.roundPhase >= 1) {
            const action = this.gameData.roundPhase % 2 === 0 ? 'take' : 'give'
            console.log(action)
            const card = this.gameData.cardsRiver[action][
              this.gameData.cardsRiver[action].length - 1
            ]
            console.log(this.gameData.cardsRiver)

            statusData.text = `${action.toUpperCase()} ${
              this.gameData.round < 5
                ? this.gameData.roundPhase * 2
                : this.gameData.cardsRiver.give.length * 2
            }: Players with ${card.card}`
          } else {
            statusData.text = 'SETTING UP RIVER'
          }

          break
        default:
          statusData.title = '...'
          statusData.text = '...'
      }
      if (this.gameData.state === 'ended') {
        statusData.title = 'GAME OVER'
        statusData.text = ''
      }
      return statusData
    },
    statusMessage() {
      //TODO: refactor this disaster
      let message = ''
      if (this.gameData.round === 5) {
        console.log(this.gameData.givingDrinks)
        console.log(this.gameData.drinksGiven)
        if (
          this.gameData.givingDrinks.length < 1 &&
          this.gameData.drinksGiven.length < 1
        ) {
          return 'No one has matching card value'
        }

        if (this.gameData.givingDrinks) {
          if (this.gameData.givingDrinks.length > 1) {
            const givingDrinks = [...this.gameData.givingDrinks]
            givingDrinks.shift()
            message += '...followed by '
            console.log(givingDrinks)
            console.log(this.gameData.givingDrinks)
            givingDrinks.forEach((gd, i) => {
              message += `
            ${this.playerDataById[gd.id].name} ${
                i < givingDrinks.length - 1 ? ', ' : ''
              }
          `
            })
          }

          if (this.gameData.givingDrinks.length === 1) {
            message =
              this.playerDataById[this.gameData.givingDrinks['0'].id].name +
              ' is giving drinks.'
          }

          return message
        } else {
          return 'Round 5 not match'
        }
      } else if (
        this.gameData.givingDrinks &&
        this.gameData.givingDrinks['0']
      ) {
        this.gameData.givingDrinks['0'] &&
        this.gameData.givingDrinks['0'].id === this.player.id
          ? 'CORRECT!'
          : this.playerDataById[this.gameData.givingDrinks['0'].id].name +
            ' is giving drinks.'

        return message
      } else if (this.gameData.drinksGiven.length > 0) {
        this.gameData.drinksGiven.forEach((d, i) => {
          message += `
            ${this.playerDataById[d.player].name} drink ${d.drinks}${
            i < this.gameData.drinksGiven.length - 1 ? ', ' : ''
          }
          `
        })
        return message
        //
      } else if (this.gameData.activePlayer) {
        return `Awaiting ${
          this.playerDataById[this.gameData.activePlayer].name
        }'s turn.`
      } else if (this.gameData.state === 'ended') {
        return 'The game has ended.'
      } else {
        return 'CHEERS'
      }
    },
    turnProgressBar() {
      let timeleft = this.turnTimeLeft / 100
      return {
        show: !this.btnSubmit.show && this.turnTimeLeft > 0,
        style: {
          width: timeleft + '%'
        },
        text: timeleft + ' Sec..',
        class: ['bgPrimary'],
        timeleft: timeleft
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
    selectChoice(choice) {
      this.$store.dispatch('setStateByKey', {
        key: 'choiceSelected',
        val: { ...choice }
      })
    }
    // submitDrinks() {
    //   this.$emit

    // }
  }
}
</script>

<template>
  <div
    class="uk-card uk-card-default uk-backgrond-muted uk-flex uk-flex-column  uk-flex-middle uk-justify-between"
    :style="dynamicStyles.statusCard"
    ref="statusCard"
  >
    <p v-if="isLoading">LOADING....</p>
    <div class="uk-flex uk-flex-column uk-flex-center uk-flex-middle" v-else>
      <div
        class=" uk-text-primary uk-text-bold uk-text-nowrap"
        :style="dynamicStyles.statusTitle"
      >
        {{ gameStatus.title }}
      </div>
      <div class="description">
        {{ gameStatus.text }}
      </div>
      <template v-if="!isLoading && gameData.round < 5">
        <transition
          :name="deckImage === cardImgBack ? 'fade' : 'flip'"
          mode="out-in"
        >
          <img
            :key="deckImage"
            class="deckImg"
            :style="dynamicStyles.deckImg"
            :src="deckImage"
            @click="
              $emit('viewCard', deckImage === cardImgBack ? null : deckImage)
            "
          />
        </transition>
      </template>
      <div v-else class=" uk-width-1-1">
        <transition-group
          name="fadeInLeftBig"
          tag="div"
          appear
          class="uk-flex uk-flex-around"
        >
          <div v-for="n in 4" :key="'rvrup' + n">
            <transition name="flip">
              <img
                :key="
                  gameData.cardsRiver.give[n - 1]
                    ? cardImg(gameData.cardsRiver.give[n - 1])
                    : cardImgBack
                "
                class="ui image deckImgRiver"
                :src="
                  gameData.cardsRiver.give[n - 1]
                    ? cardImg(gameData.cardsRiver.give[n - 1])
                    : cardImgBack
                "
                @click="
                  $emit(
                    'viewCard',
                    gameData.cardsRiver.give[n - 1]
                      ? cardImg(gameData.cardsRiver.give[n - 1])
                      : deckImage
                  )
                "
              />
            </transition>
          </div>
        </transition-group>
        <transition-group
          name="fadeInRightBig"
          tag="div"
          appear
          class="uk-flex uk-flex-around"
        >
          <div v-for="n in 4" :key="'rvrdwn' + n">
            <transition name="flip">
              <img
                :key="
                  gameData.cardsRiver.take[n - 1]
                    ? cardImg(gameData.cardsRiver.take[n - 1])
                    : cardImgBack
                "
                class="deckImgRiver"
                :src="
                  gameData.cardsRiver.take[n - 1]
                    ? cardImg(gameData.cardsRiver.take[n - 1])
                    : cardImgBack
                "
                @click="
                  $emit(
                    'viewCard',
                    gameData.cardsRiver.take[n - 1]
                      ? cardImg(gameData.cardsRiver.take[n - 1])
                      : deckImage
                  )
                "
              />
            </transition>
          </div>
        </transition-group>
      </div>
      <h4
        v-if="gameData.state === 'pending'"
        v-text="`${gameData.players.length}/${gameData.playersCount} PLAYERS`"
        class="uk-margin-remove"
      ></h4>
      <div class="choiceDiv" v-if="btnSubmit.show">
        <a
          href=""
          class="uk-icon-button uk-margin-small-right uk-margin-small-left"
          v-for="choice in choiceBtns"
          :key="choice.value"
          @click.prevent="selectChoice(choice)"
          :class="
            choiceSelected && choiceSelected.value === choice.value
              ? choice.selectedClass
              : choice.class
          "
        >
          <component
            v-if="choice.icon"
            :is="choice.icon"
            :class="choice.iconClass"
            class="icon-2x"
            :title="choice.tooltipText || 'SET THIS'"
          ></component>
        </a>
      </div>
      <h4 v-else v-text="statusMessage" class="uk-margin-small-top"></h4>
    </div>

    <button
      v-if="btnSubmit.show"
      class="uk-button uk-button-small uk-width-1-1 submitBtn"
      :class="btnSubmit.class"
      :disabled="btnSubmit.isDisabled"
      @click="$emit('submitAction')"
    >
      <div uk-spinner v-if="btnSubmit.isLoading"></div>

      <template v-else>
        <component
          v-if="btnSubmit.icon"
          :is="btnSubmit.icon"
          class="uk-margin-small-right"
        ></component>
        <span>{{ btnSubmit.text }}</span>
      </template>
    </button>
    <progress
      v-if="turnProgressBar.show"
      class="uk-progress uk-margin-remove-vertical"
      :value="turnProgressBar.timeleft"
      max="100"
      style="overflow-x: hidden"
    ></progress>
  </div>
</template>
<style lang="css" scoped>
.btnBlack {
  background-color: black;
}
.btnRed {
  background-color: red;
}

.deckImg {
  /* height: 100px; */
  margin-top: 10px;
}

.deckRiverRow {
  margin-top: 30px;
  widows: 100%;
}
.deckRiverRow .ui.grid > .column:not(.row) {
  padding-top: 0rem;
  padding-bottom: 0rem;
}

.deckImgRiver {
  height: 80px;
  width: 60px;
  transform: rotate(90deg);
}

.choiceBtn {
  margin: 0px 10px;
}

.choiceDiv {
  padding: 20px 0px;
}

.statusCard {
  flex-grow: 1;
  height: 22em;
}

.submitBtn {
  max-width: 30em;
}

.uk-button-small {
  font-size: 20px;
}

.uk-button-black {
  background-color: #000000;
  color: #fff;
  border: 1px solid transparent;
}
.uk-button-red {
  background-color: #d40000;
  color: #fff;
  border: 1px solid transparent;
}

.material-design-icon.icon-2x {
  height: 2em;
  width: 2em;
}

.material-design-icon.icon-2x > .material-design-icon__svg {
  height: 2em;
  width: 2em;
}
</style>
