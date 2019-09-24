<template>
  <q-footer v-if="$q.platform.is.ios">
    <tab-nav />
  </q-footer>
</template>

<script>
import TabNav from './TabNav.vue'

export default {
  name: 'AppFooter',
  components: {
    TabNav,
  },
}
</script>

<style>
</style>
