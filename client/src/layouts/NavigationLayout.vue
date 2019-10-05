<template>
  <q-page-container>
    <app-header />
    <transition
      appear
      enter-active-class="animated slideInRight"
      leave-active-class="animated slideOutLeft"
      mode="out-in"
    >
      <router-view />
    </transition>
    <app-footer />
  </q-page-container>
</template>

<script>
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

export default {
  name: 'NavigationLayout',
  components: {
    AppHeader,
    AppFooter,
  },
}
</script>

<style>
</style>
