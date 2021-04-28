// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import config from './appconfig.js'
// import io from 'socket.io-client'

// require('semantic-ui-css/semantic.css')
import 'vue-material-design-icons/styles.css'

// require('uikit/dist/css/uikit.css')
// require('uikit/dist/js/uikit.min.js')
// require('uikit/dist/js/uikit-icons.min.js')

Vue.config.productionTip = false
Vue.prototype.$appConfig = config

// new Vue({
//   el: '#app',
//   store,
//   router,
//   components: {
//     App
//   },
//   template: '<App/>'
// })
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
