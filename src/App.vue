<template>
  <div id="app" class="app">
    <titlebar></titlebar>
    <div class="uk-container uk-flex uk-flex-center uk-flex-top">
      <router-view class="Appcontent" />
    </div>
  </div>
</template>

<script>
import titlebar from '@/components/titlebar'
// import io from 'socket.io-client'
import UIkit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons'

UIkit.use(Icons)
export default {
  name: 'App',
  components: {
    titlebar
  },
  created() {
    console.log('App vue created')
    // this.$store
    //   .dispatch('apiCall', { endpoint: '/user/session' })
    //   .then(res => {
    //     console.log(res)
    //     if (res.data.activeGame) {
    //       //redirect to active game componet, pass game id
    //       //active game return a way to tell if last game is expired
    //       //show message "last game expired"
    //     } else {
    //       this.$store.dispatch('setStateValue', {
    //         key: 'player',
    //         val: {
    //           id: res.data.id,
    //           name: res.data.name,
    //           statistics: res.data.statistics
    //         }
    //       })
    //       console.log(this.$store.state)
    //     }
    //   })
    //   .catch(err => console.log(err))
    // console.log(this.$store)
    // var socket = io('http://localhost:3000')
    // socket.on('news', function(data) {
    //   console.log(data)
    //   socket.emit('my other event', { my: 'data' })
    // })
  }
}
</script>
<style lang="less">
// @import '../node_modules/uikit/src/less/uikit.less';
@import './assets/less/theme.less';
</style>
<style>
body {
  /* background: #c5c5c5; */
}

a {
  color: #2b2351;
}

p {
  margin-bottom: 0px;
}

.app {
  height: 100vh;
}

.bgDisabled {
  background: #78777a !important;
  color: white !important;
}
.bgPrimary {
  background: #2b2351 !important;
  color: white !important;
}
.Appcontent {
  /* margin-top: 55px; */
}

.fontDisabled {
  color: #a9a4bf !important;
}
.fontPrimary {
  color: #2b2351 !important;
}

>>> .material-design-icon {
  fill: white !important;
  height: 1.5em !important;
  width: 1.5em !important;
}
>>> .material-design-icon > .material-design-icon__svg {
  fill: white !important;
  height: 1.5em !important;
  width: 1.5em !important;
}

>>> .material-design-icon .icon-big {
  height: 1.5em !important;
  width: 1.5em !important;
}

>>> .material-design-icon-big.primary > .material-design-icon__svg {
  fill: #2b2351 !important;
}

>>> .material-design-icon.icon-big > .material-design-icon__svg {
  height: 1.5em;
  width: 1.5em;
}

.flip-enter-active {
  -webkit-animation: flipIn 1s both;
  animation: flipIn 1s both;
}

/* .fade-leave-active {
  animation: fadeOut ease 1s;
  -webkit-animation: fadeOut ease 1s;
  -moz-animation: fadeOut ease 1s;
  -o-animation: fadeOut ease 1s;
  -ms-animation: fadeOut ease 1s;
} */
.fade-leave-active {
  animation: fadeOut ease 0.6s;
  -webkit-animation: fadeOut ease 0.6s;
  -moz-animation: fadeOut ease 0.6s;
  -o-animation: fadeOut ease 0.6s;
  -ms-animation: fadeOut ease 0.6s;
}

.fadeInLeftBig-enter-active {
  -webkit-animation-name: fadeInLeftBig;
  animation-name: fadeInLeftBig;
  -webkit-animation-duration: 0.5s;
  animation-duration: 0.5s;
}

.fadeInRightBig-enter-active {
  -webkit-animation-name: fadeInRightBig;
  animation-name: fadeInRightBig;
  -webkit-animation-duration: 0.5s;
  animation-duration: 0.5s;
}

.heartBeat-enter-active {
  -webkit-animation-name: heartBeat;
  animation-name: heartBeat;
  -webkit-animation-duration: 1.3s;
  animation-duration: 1.3s;
  -webkit-animation-timing-function: ease-in-out;
  animation-timing-function: ease-in-out;
}

.pulse-enter-active {
  -webkit-animation-name: pulse;
  animation-name: pulse;
}

.slideInDown-enter-active {
  -webkit-animation-name: slideInDown;
  animation-name: slideInDown;
  -webkit-animation-duration: 0.3s;
  animation-duration: 0.3s;
  -webkit-animation-timing-function: ease-in-out;
  animation-timing-function: ease-in-out;
}
.slideInDown-leave-active {
  -webkit-animation-name: slideOutUp;
  animation-name: slideOutUp;
  -webkit-animation-duration: 0.3s;
  animation-duration: 0.3s;
  -webkit-animation-timing-function: ease-in-out;
  animation-timing-function: ease-in-out;
}

.slideOutUp {
  -webkit-animation-name: slideOutUp;
  animation-name: slideOutUp;
}
/**
 * ----------------------------------------
 * animation heartBeat
 * ----------------------------------------
 */

@-webkit-keyframes heartBeat {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }

  14% {
    -webkit-transform: scale(1.3);
    transform: scale(1.3);
  }

  28% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }

  42% {
    -webkit-transform: scale(1.3);
    transform: scale(1.3);
  }

  70% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

@keyframes heartBeat {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }

  14% {
    -webkit-transform: scale(1.3);
    transform: scale(1.3);
  }

  28% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }

  42% {
    -webkit-transform: scale(1.3);
    transform: scale(1.3);
  }

  70% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

/**
 * ----------------------------------------
 * animation flip
 * ----------------------------------------
 */
@keyframes flipIn {
  from {
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0)
      rotate3d(0, 1, 0, -360deg);
    animation-timing-function: ease-out;
    opacity: 0;
  }
  40% {
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 150px)
      rotate3d(0, 1, 0, -190deg);
    animation-timing-function: ease-out;
    opacity: 0.4;
  }
  50% {
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 150px)
      rotate3d(0, 1, 0, -170deg);
    animation-timing-function: ease-in;
    opacity: 0.5;
  }
  80% {
    transform: perspective(400px) scale3d(0.95, 0.95, 0.95) translate3d(0, 0, 0)
      rotate3d(0, 1, 0, 0deg);
    animation-timing-function: ease-in;
    opacity: 0.8;
  }
  to {
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0)
      rotate3d(0, 1, 0, 0deg);
    animation-timing-function: ease-in;
    opacity: 1;
  }
}

@keyframes flipOut {
  from {
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0)
      rotate3d(0, 1, 0, 0deg);
    animation-timing-function: ease-in;
    opacity: 1;
  }
  40% {
    transform: perspective(400px) scale3d(0.95, 0.95, 0.95) translate3d(0, 0, 0)
      rotate3d(0, 1, 0, 0deg);
    animation-timing-function: ease-in;
    opacity: 0.6;
  }
  50% {
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 150px)
      rotate3d(0, 1, 0, -170deg);
    animation-timing-function: ease-in;
    opacity: 0.5;
  }
  80% {
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 150px)
      rotate3d(0, 1, 0, -190deg);
    animation-timing-function: ease-out;
    opacity: 0.2;
  }
  to {
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0)
      rotate3d(0, 1, 0, -360deg);
    animation-timing-function: ease-out;
    opacity: 0;
  }
}

/* PULSE */
/* PULSE */
@keyframes pulse {
  from {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }

  50% {
    -webkit-transform: scale3d(1.05, 1.05, 1.05);
    transform: scale3d(1.05, 1.05, 1.05);
  }

  to {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}

/* SLIDE IN LEFT BIG */
/* SLIDE IN LEFT BIG */

@-webkit-keyframes fadeInLeftBig {
  from {
    opacity: 0;
    -webkit-transform: translate3d(-2000px, 0, 0);
    transform: translate3d(-2000px, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes fadeInLeftBig {
  from {
    opacity: 0;
    -webkit-transform: translate3d(-2000px, 0, 0);
    transform: translate3d(-2000px, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
/* SLIDE IN RIGHT BIG */
/* SLIDE IN RIGHT BIG */

@-webkit-keyframes fadeInRightBig {
  from {
    opacity: 0;
    -webkit-transform: translate3d(2000px, 0, 0);
    transform: translate3d(2000px, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes fadeInRightBig {
  from {
    opacity: 0;
    -webkit-transform: translate3d(2000px, 0, 0);
    transform: translate3d(2000px, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

/* SLIDE IN DOWN */
/* SLIDE IN DOWN */
@-webkit-keyframes slideInDown {
  from {
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
    visibility: visible;
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes slideInDown {
  from {
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
    visibility: visible;
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@-webkit-keyframes slideOutUp {
  from {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  to {
    visibility: hidden;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
}

@keyframes slideOutUp {
  from {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  to {
    visibility: hidden;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
}
</style>
