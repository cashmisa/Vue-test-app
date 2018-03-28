import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import WelcomePage from './components/welcome/welcome.vue'
import SignUpPage from './components/auth/signup.vue'
import SignInPage from './components/auth/signin.vue'
import DashboardPage from './components/dashboard/dashboard.vue'
import Admin from './components/admin/Admin.vue'

Vue.use(VueRouter)

const routes = [
  {path: '/', component: WelcomePage, name: 'Welcome'},
  {path: '/sign-up', component: SignUpPage, name: 'SignUp'},
  {path: '/sign-in', component: SignInPage, name: 'SignIn'},
  {
    path: '/admin',
    component: Admin,
    name: 'Admin',
    beforeEnter (to, from, next) {
      if(!store.getters.isAdmin){ //if not admin user, we redirect
        next('/sign-in')
      }
      else{
        next()
      }
    }
  },
  {
    path: '/dashboard',
    component: DashboardPage,
    name: 'Dashboard',
    beforeEnter (to, from, next) {
      if(!store.state.idToken){ //if no token, we redirect
        next('/sign-in')
      }
      else{ //we have valid token
        next()
      }
    }
  }
]

export default new VueRouter({
  mode: 'history',
  routes
})
