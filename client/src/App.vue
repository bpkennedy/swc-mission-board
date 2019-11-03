<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import Vue from 'vue'
import 'leaflet/dist/leaflet.css'
import { GET_INITIAL_APP_DATA } from './store'

export default {
  name: 'App',
  mounted() {
    this.$store.dispatch(GET_INITIAL_APP_DATA)
    Vue.prototype.$socket.on('news', function(data) {
      console.log(data)
    })
  }
}
</script>

<style>
</style>
