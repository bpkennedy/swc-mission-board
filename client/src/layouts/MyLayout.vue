<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Mission Board
        </q-toolbar-title>

        <q-avatar rounded>
          <q-img
            :src="currentUserPhotoUrl"
            spinner-color="white"
            style="height: 100%; max-width: 100%"
          />
        </q-avatar>
      </q-toolbar>
      <tab-nav v-if="!$q.platform.is.ios" />
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer v-if="$q.platform.is.ios">
      <tab-nav />
    </q-footer>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import TabNav from '../components/TabNav.vue'

export default {
  name: 'MyLayout',
  components: {
    TabNav,
  },
  computed: {
    currentUserPhotoUrl() {
      return this.$store.state.user.image ? this.$store.state.user.image : ''
    },
    currentUserName() {
      return this.$store.state.user.handle ? this.$store.state.user.handle : ''
    }
  },
  methods: {
    openURL
  }
}
</script>

<style>
</style>
