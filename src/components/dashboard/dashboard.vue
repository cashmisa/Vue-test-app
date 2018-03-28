<template>
  <div id="Dashboard">
    <h1>That's the dashboard!</h1>
    <p class="text-warning">You should only get here if you're authenticated!</p>
    <div v-if="userEmail">
      
    <h3>Your mail address is: </h3>
      <h2>{{userEmail}}</h2>
    </div>
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
      userEmail(){
        return this.$store.getters.userEmail? this.$store.getters.userEmail : false
      }
    }
  }
</script>
<style scoped>
  h1, h2, h3, p {
    text-align: center;
  }

  .text-warning {
    color: red;
  }
</style>
