<template>
  <q-page
    class="flex flex-center column"
    padding
  >
    <single-mission-map
      v-if="!loadingIsVisible && hasLocationData"
      :starting-x="mission.startingX"
      :starting-y="mission.startingY"
      :ending-x="mission.endingX"
      :ending-y="mission.endingY"
      :starting-system-name="mission.startingSystemName"
      :ending-system-name="mission.endingSystemName"
    />
    <div v-if="!loadingIsVisible">
      {{ mission.description }}
    </div>
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
import { GET_MISSION_ACTION } from '../store'
import SingleMissionMap from '../components/SingleMissionMap.vue'

export default {
  name: 'Mission',
  components: {
    SingleMissionMap,
  },
  data() {
    return {
      loadingIsVisible: true,
    }
  },
  computed: {
    ...mapState([
      'mission'
    ]),
    hasLocationData() {
      return this.mission.startingSystemName || this.mission.endingSystemName
    },
  },
  async mounted() {
    await this.$store.dispatch(GET_MISSION_ACTION, this.$route.params.id)
    this.loadingIsVisible = false
  }
}
</script>
