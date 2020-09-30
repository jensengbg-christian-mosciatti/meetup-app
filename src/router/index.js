import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Signup from '../views/SignUp.vue'
import Signin from '../views/SignIn.vue'
import Dashboard from '../views/Dashboard.vue'
import Postmeet from '../views/PostMeet.vue'
import Meet from '../views/Meet.vue'

import store from '@/store/index'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/login',
    name: 'Login',
    component: Signin,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/newmeet',
    name: 'Postmeet',
    component: Postmeet,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/meet/:id',
    name: 'meet',
    component: Meet,
    meta: {
      requiresAuth: false,
    },
    props: true,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // if (Vue.$cookies.get('connect.sid') == null) {
    if (!store.state.isAuthenticated) {
      // console.log('tofull: ', to.fullPath)
      next({
        path: '/login',
        query: { nextUrl: to.fullPath },
      })
    } else {
      let user = JSON.parse(localStorage.getItem('user'))
      if (to.matched.some((record) => record.meta.is_admin)) {
        if (user.is_admin == 1) {
          next()
        } else {
          next({ name: 'userboard' })
        }
      } else {
        next()
      }
    }
  } else if (to.matched.some((record) => record.meta.guest)) {
    if (localStorage.getItem('jwt') == null) {
      next()
    } else {
      next({ name: 'userboard' })
    }
  } else {
    next()
  }
})

export default router
