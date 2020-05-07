import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import landing from '@/components/landing'
import activeGame from '@/components/activeGame'
import newGame from '@/components/newGame'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/newGame',
      name: 'newGame',
      component: newGame
    },
    {
      path: '/game',
      name: 'activeGame',
      component: activeGame,
      props: true
    },
    // {
    //   path: '*',
    //   name: 'landing',
    //   component: landing,
    //   props: true
    // },
    {
      path: '/',
      name: 'landing',
      alias: '*',
      component: landing,
      props: true
    }
  ]
})

router.beforeEach((to, from, next) => {
  // console.log(to)
  // console.log(from)
  // console.log(store.state)
  if (store.state && !store.state.player.id) {
    store.dispatch('getSession').then(resp => {
      if (resp) {
        if (resp.data && resp.data.activeGame) {
          next({ name: 'activeGame' })
        } else {
          next()
        }
      }
    })
  } else {
    if (store.state.player.activeGame && to.name !== 'activeGame') {
      next({ name: 'activeGame' })
    } else {
      next()
    }
  }
})

export default router
