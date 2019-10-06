<template>
  <q-layout view="lHh Lpr lFf">
    <transition
      appear
      :enter-active-class="transitionEnterName"
      :leave-active-class="transitionLeaveName"
      mode="out-in"
    >
      <router-view />
    </transition>
  </q-layout>
</template>

<script>
export default {
  name: 'RootLayout',
  watch: {
    '$route' (to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionEnterName = toDepth < fromDepth ? 'animated slideInRight' : 'animated slideInLeft'
      this.transitionLeaveName = toDepth < fromDepth ? 'animated slideOutLeft' : 'animated slideOutRight'
    }
  }
}
</script>

<style>
</style>
