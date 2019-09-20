<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { GET_PROFILE_ACTION } from './store'
export default {
  name: 'App',
  mounted() {
    this.$store.dispatch(GET_PROFILE_ACTION)
  }
}
</script>

<style>
</style>
