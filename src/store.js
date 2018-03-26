import Vue from 'vue'
import Vuex from 'vuex'
import axios from './axios-auth'
import globalAxios from 'axios'
import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    user: null
  },
  getters: {
    user(state){ return state.user},
    isAuthenticated(state) { return !!state.idToken }
  },
  mutations: {
    authUser(state, authData){
      state.idToken = authData.idToken;
      state.userId = authData.userId
    },
    storeUser(state, user){
      state.user = user
    },
    logoutUser(state){
      state.user = null;
      state.idToken = null;
      state.userId = null
    },
  },
  actions: {
    setLogoutTimer({commit, dispatch}, expiresIn){
      setTimeout(() => {
        dispatch('logout')
      }, expiresIn * 1000)
    },
    signup({commit, dispatch}, payload){
      axios.post('/signupNewUser?key=AIzaSyDRuORIhzPAICChEnwRmPg-gbSk3xje6NA', {
        email: payload.email,
        password: payload.password,
        returnSecureToken: true
      })
        .then( res => {
          console.log('>>>>>>signed up: ', res)
          commit('authUser', {
            idToken : res.data.idToken,
            userId : res.data.localId
          });
          localStorage.setItem('token', res.data.idToken)
          //not so optimal to store the amount of seconds but the date its valid till
          // localStorage.setItem('expiresIn', res.data.expiresIn)
          const expiresIn = new Date(Date.now() + res.data.expiresIn * 1000)
          localStorage.setItem('expiresIn', expiresIn)
          localStorage.setItem('userId', res.data.localId)
          dispatch('storeUser', payload)
          dispatch('setLogoutTimer', res.data.expiresIn)
          router.push({name: 'Dashboard'})
        })
        .catch(err => console.log(err))
    },
    signin({commit, dispatch}, payload){
      axios.post('/verifyPassword?key=AIzaSyDRuORIhzPAICChEnwRmPg-gbSk3xje6NA', {
        email: payload.email,
        password: payload.password,
        returnSecureToken: true
      }).then(res => {
        commit('authUser', {
          idToken: res.data.idToken,
          userId: res.data.localId
        })
        localStorage.setItem('token', res.data.idToken)
        //not so optimal to store the amount of seconds but the date its valid till
        // localStorage.setItem('expiresIn', res.data.expiresIn)
        const expiresIn = new Date(Date.now() + res.data.expiresIn * 1000)
        localStorage.setItem('expiresIn', expiresIn)
        localStorage.setItem('userId', res.data.localId)
        dispatch('storeUser', payload)
        dispatch('setLogoutTimer', res.data.expiresIn)
        router.push({name: 'Dashboard'})
        console.log('>>>>>>logged in');
      })
        .catch(err => console.log(err))
    },
    logout({commit}){
        commit('logoutUser')
        router.replace({name: 'SignIn'}) //so that we cannot go back
        localStorage.removeItem('token');
        localStorage.removeItem('expiresIn');
        localStorage.removeItem('userId');
        //localStorage.clear() to clear all items
    },
    tryAutoLogin({commit}){
        //check if i have a valid token in local storage
        const token = localStorage.getItem('token')
        if(!token){ return }
        //but if have a token, is it still valid
        const expiresIn = localStorage.getItem('expiresIn')
        if(expiresIn <= Date.now()){ return }
        // here means there is a valid token
        else {
          commit('authUser', { //log user in
            idToken: token,
            userId: localStorage.getItem('userId')
          });
          dispatch('setLogoutTimer', res.data.expiresIn)
        }
    },
    fetchUser({commit, state}){
      if(!state.idToken){
        return
      }
      else {
        globalAxios.get('/users.json' + '?auth=' + state.idToken)
          .then(res => { //res is object
            //loop through users
            const data = res.data
            const users = []
            for (let key in data) {
              const user = data[key]
              user.id = key
              users.push(user)
            }
            commit('storeUser', users[0])
          })
          .catch(err => console.log('>>>>>>>>>error' + err))
      }
    },
    storeUser({commit, state}, payload){
      //pass id token with the store request
      if(!state.idToken){ //null
        return
      }
      else{  //token is not null: append the token with the http requests
        //depending on backend, some asked to attach in the header, firebase is query string
        globalAxios.post('/users.json' + '?auth=' + state.idToken, payload)
          .then(
          res => {
            console.log('>>>>>>posted to db with res: ', res)
            commit('storeUser', payload)
          }
        );
      }
    },
  }
})
