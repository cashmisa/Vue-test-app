import Vue from 'vue'
import VueRouter from 'vue-router'

import WelcomePage from './components/welcome/welcome.vue'
import SignUpPage from './components/auth/signup.vue'
import SignInPage from './components/auth/signin.vue'
import DashboardPage from './components/dashboard/dashboard.vue'

Vue.use(VueRouter)

const routes = [
  {path: '/', component: WelcomePage, name: 'Welcome'},
  {path: '/sign-up', component: SignUpPage, name: 'SignUp'},
  {path: '/sign-in', component: SignInPage, name: 'SignIn'},
  {path: '/dashboard', component: DashboardPage, name: 'Dashboard'}
]

export default new VueRouter({
  mode: 'history',
  routes
})
