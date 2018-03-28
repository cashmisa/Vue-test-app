// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import router from './router'
import store from './store'
import Vuelidate from 'vuelidate'
import VueNumeric from 'vue-numeric'
import VueTheMask from 'vue-the-mask'

Vue.config.productionTip = false

Vue.use(Vuelidate)
Vue.use(VueNumeric)
Vue.use(VueTheMask)

axios.defaults.baseURL = 'https://fir-ex-bfd10.firebaseio.com'
// const reqInterceptor = axios.interceptors.request.use(config => {
//     console.log(config)
//     return config
// })
// const resInterceptor = axios.interceptors.response.use(res => {
//     console.log(res)
//     return res
// })
// axios.interceptors.request.eject(reqInterceptor)
// axios.interceptors.response.eject(resInterceptor)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
