<template>
  <div id="app">
    <Header></Header>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from './components/header/header'

export default {
  name: 'App',
  components: {
    Header
  },
  created(){
      this.$store.dispatch('tryAutoLogin')
  }

}
</script>

<style>
  body, html {
    margin: 0;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
</style>
