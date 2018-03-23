<template>
  <div id="Dashboard">
    <h1>That's the dashboard!</h1>
    <p>You should only get here if you're authenticated!</p>
    <p>Your mail address is: {{email}}</p>
  </div>
</template>
<script>
  import axios from 'axios'
  export default{
    name: 'Dashboard',
    created(){
      axios.get('/users.json')
        .then(res => { //res is object
          //loop through users
          const data = res.data
          const users = []
          for (let key in data){
            const user = data[key]
            user.id = key
            users.push(user)
          }
          this.email = users[0].email
        })
        .catch(err => console.log('>>>>>>>>>error' + err))
    },
    data(){
      return {
        email: ''
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
