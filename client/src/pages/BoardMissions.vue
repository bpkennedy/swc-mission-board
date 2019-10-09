<template>
  <q-page class="row">
    <missions-list
      :missions="boardMissions"
      class="col"
    />
    <missions-map
      v-if="!$q.platform.is.mobile"
      :key="mapRerenderFlag"
      class="col-8"
      :missions="boardMissions"
    />
    <q-inner-loading
      :showing="loadingIsVisible"
      transition-show="fade"
      transition-hide="fade"
    >
      <q-spinner-pie
        size="4em"
        color="primary"
      />
    </q-inner-loading>
  </q-page>
</template>

<style>
</style>

<script>
import { mapState } from 'vuex'
import { GET_BOARD_MISSIONS_ACTION } from '../store'
import MissionsList from '../components/MissionsList.vue'
import MissionsMap from '../components/MissionsMap.vue'

export default {
  name: 'BoardMissions',
  components: {
    MissionsList,
    MissionsMap,
  },
  data() {
    return {
      loadingIsVisible: true,
      mapRerenderFlag: 0,
    }
  },
  computed: {
    ...mapState([
      'boardMissions'
    ]),
  },
  methods: {
    forceMapRerender() {
      this.mapRerenderFlag += 1
    }
  },
  async mounted() {
    await this.$store.dispatch(GET_BOARD_MISSIONS_ACTION, {
      boardId: this.$route.params.id,
      router: this.$router
    })
    this.loadingIsVisible = false
  },
  watch: {
    boardMissions() {
      this.forceMapRerender()
    }
  }
}
</script>
