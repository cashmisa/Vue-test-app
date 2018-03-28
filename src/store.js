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
    userEmail: null,
    user: null
  },
  getters: {
    user(state){
      return state.user
    },
    userEmail(state){
      return state.userEmail
    },
    isAuthenticated(state) {
      return !!state.idToken
    },
    isAdmin(state) {
      return state.userEmail? state.userEmail === 'test@test.com' : false
    }
  },
  mutations: {
    authUser(state, authData){
      state.idToken = authData.idToken;
      state.userId = authData.userId;
      state.userEmail = authData.userEmail;
    },
    storeUser(state, user){
      state.user = user
    },
    logoutUser(state){
      state.user = null;
      state.idToken = null;
      state.userId = null
      state.userEmail = null;
    },
  },
  actions: {
    //auto log out user upon token expires, expires passed in are expected to be in second
    setLogoutTimer({commit, dispatch}, expiresIn){
      setTimeout(() => {
        dispatch('logout')
      }, expiresIn * 1000)
    },
    //go to server with info, get token upon success in response,
    //commit series ouf actions including
    // 1. store authentication info via 'authUser'
    // 2. store the authentication info in browser local storage to overcome stateless
    // 3. post user sign-up info in user db too
    // 4. set a logout timer to auto log out user upon token expire
    // 5. redirect user with router.push
    signup({commit, dispatch}, formData){
      axios.post('/signupNewUser?key=AIzaSyDRuORIhzPAICChEnwRmPg-gbSk3xje6NA', {
        email: formData.email,
        password: formData.password,
        returnSecureToken: true
      })
        .then( res => {
          commit('authUser', {
            idToken : res.data.idToken,
            userId : res.data.localId,
            userEmail: formData.email
          });
          localStorage.setItem('userEmail', formData.email)
          localStorage.setItem('idToken', res.data.idToken)
          localStorage.setItem('userId', res.data.localId)
          const expiresIn = new Date(Date.now() + res.data.expiresIn * 1000)
          localStorage.setItem('expiresIn', expiresIn)

          dispatch('storeUserInDb', formData)
          dispatch('setLogoutTimer', res.data.expiresIn)
          router.push({name: 'Dashboard'})
        })
        .catch(err => console.log(err))
    },
    //go to server with info, get token upon success in response,
    //commit series ouf actions including
    // 1. store authentication info via 'authUser'
    // 2. store the authentication info in browser local storage to overcome stateless
    // 3. set a logout timer to auto log out user upon token expire
    // 4. redirect user with router.push
    signin({commit, dispatch, getters}, formData){
      axios.post('/verifyPassword?key=AIzaSyDRuORIhzPAICChEnwRmPg-gbSk3xje6NA', {
        email: formData.email,
        password: formData.password,
        returnSecureToken: true
      }).then(res => {
        commit('authUser', {
          idToken: res.data.idToken,
          userId: res.data.localId,
          userEmail: formData.email,
        })
        localStorage.setItem('userEmail', formData.email)
        localStorage.setItem('idToken', res.data.idToken)
        localStorage.setItem('userId', res.data.localId)
        const expiresIn = new Date(Date.now() + res.data.expiresIn * 1000)
        localStorage.setItem('expiresIn', expiresIn)
        commit('storeUser', formData)
        dispatch('setLogoutTimer', res.data.expiresIn)
        if (getters.isAdmin){
          router.push({name: 'Admin'})
          return
        }
        router.push({name: 'Dashboard'})
      })
        .catch(err => console.log('>>>>>error: message is ', err))
    },
    //when log out, clear the page instance and browser's user token
    //redirect user
    logout({commit}){
        commit('logoutUser')
        // localStorage.removeItem('idToken');
        localStorage.clear()
        router.replace({name: 'SignIn'}) //so that we cannot go back
    },
    //upon launching app and page refresh
    //check if already has valid token in browser, if so, log user in with it
    tryAutoLogin({commit, dispatch}){
        //check if i have a valid token in local storage
        const idToken = localStorage.getItem('idToken')
        if(!idToken){ return }
        //but if have a token, is it still valid
        const expiresIn = localStorage.getItem('expiresIn')
        if(expiresIn <= Date.now()){ return }

        // here means there is a valid token
        else {
          const userId = localStorage.getItem('userId')
          const userEmail = localStorage.getItem('userEmail')
          commit('authUser', {
            idToken: idToken,
            userId: userId,
            userEmail: userEmail
          });
          //dispatch('setLogoutTimer', getRemainingSeconds)
          router.replace({name: 'Dashboard'})
        }
    },
    // bad example here as no getUserById(id) with this api
    // just simulating getting the right user and its role
    fetchUser({commit, state}){
      if(!state.idToken){
        return
      }
      else {
        globalAxios.get('/users.json' + '?auth=' + state.idToken)
          .then(res => { //res is object
            //loop through users and store them in a local user array
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
    //store user in our user database after sign-up
    storeUserInDb({commit, state}, formData){
      //pass id token with the store request
      if(!state.idToken){ //null
        return
      }
      else{
        //token is not null: append the token with the http requests
        //depending on backend, some asked to attach in the header, firebase is query string
        globalAxios.post('/users.json' + '?auth=' + state.idToken, formData)
          .then(
          res => {
            console.log('>>>>>>posted to db with res: ', res)
            commit('storeUser', formData)
          }
        );
      }
    },
  }
})
