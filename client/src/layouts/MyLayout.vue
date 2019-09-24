<template>
  <q-layout view="lHh Lpr lFf">
    <app-header />
    <q-page-container>
      <router-view />
    </q-page-container>
    <app-footer />
  </q-layout>
</template>

<script>
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

export default {
  name: 'MyLayout',
  components: {
    AppHeader,
    AppFooter,
  }
}
</script>

<style>
</style>
