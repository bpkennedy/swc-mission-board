<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import { GET_INITIAL_APP_DATA } from './store'

export default {
  name: 'App',
  mounted() {
    this.$store.dispatch(GET_INITIAL_APP_DATA)
  }
}
</script>

<style>
</style>
