<template>
  <div id="app">
    <!-- <router-link to="/home">home</router-link>
    
    <router-link to="/about">about</router-link> -->
    <button @click="home">home</button>
    <button @click="about">about</button>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    home(){
      this.$router.push('/home')
    },
    about(){
      this.$router.push('/about')
    }
  }
}
</script>

<style>
#app {
  text-align: center;
}
</style>
