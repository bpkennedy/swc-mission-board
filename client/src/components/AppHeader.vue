<template>
  <q-header elevated>
    <q-toolbar>
      <q-avatar
        v-if="$route.name === 'boardMissions'"
        rounded
      >
        <q-img
          :src="BOARD_IMAGE_URL_GETTER($route.params.id)"
          spinner-color="white"
          style="height: 100%; max-width: 100%"
        />
      </q-avatar>
      <q-toolbar-title>
        {{ getPageTitle }}
      </q-toolbar-title>

      <q-btn
        push
        color="white"
        text-color="primary"
        icon="add"
        class="q-mr-sm"
        @click="dialog = true"
      />
      <q-btn
        flat
        round
        dense
        color="white"
        icon="notifications"
        class="q-mr-sm"
        to="/notifications"
      />
      <!-- <q-badge color="red" floating transparent>
          4
        </q-badge> -->
      <!-- </q-btn> -->
      <q-avatar rounded>
        <q-img
          :src="currentUserPhotoUrl"
          spinner-color="white"
          style="height: 100%; max-width: 100%"
        />
      </q-avatar>
    </q-toolbar>
    <tab-nav v-if="!$q.platform.is.ios" />
    <q-dialog
      v-model="dialog"
      :maximized="true"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <new-mission />
    </q-dialog>
  </q-header>
</template>

<script>
import { mapGetters } from 'vuex'
import { BOARD_IMAGE_URL_GETTER } from '../store'
import TabNav from './TabNav.vue'
import NewMission from './NewMission.vue'

export default {
  name: 'AppHeader',
  components: {
    TabNav,
    NewMission,
  },
  data() {
    return {
      dialog: false,
    }
  },
  computed: {
    ...mapGetters([
      BOARD_IMAGE_URL_GETTER,
    ]),
    currentUserPhotoUrl() {
      return this.$store.state.user.image ? this.$store.state.user.image : ''
    },
    getPageTitle() {
      if (this.$route.params.boardName) {
        return this.$route.params.boardName
      }
      return this.$route.name
    }
  },
}
</script>

<style>
</style>
