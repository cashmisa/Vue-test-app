<template>
  <div id="Dashboard">
    <h1>That's the dashboard!</h1>
    <p>You should only get here if you're authenticated!</p>
    <p v-if="user">Your mail address is: {{user.email}}</p>
  </div>
</template>
<script>
  import axios from 'axios'
  export default{
    name: 'Dashboard',
    created(){
      this.$store.dispatch('fetchUser');
    },
    computed: {
      user(){
        return this.$store.getters.user? this.$store.getters.user : false
      }
    }
  }
</script>
<style scoped>
  h1, p {
    text-align: center;
  }

  p {
    color: red;
  }
</style>
