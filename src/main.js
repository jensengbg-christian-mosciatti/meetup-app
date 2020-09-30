import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import Axios from 'axios'
import VueCookies from 'vue-cookies-reactive'
import AsyncComputed from 'vue-async-computed'

Vue.use(VueCookies)
Vue.use(AsyncComputed)

Vue.config.productionTip = false
Vue.prototype.$http = Axios

const instance = Axios.create({
  withCredentials: true,
})
Vue.prototype.$http_sec = instance

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
