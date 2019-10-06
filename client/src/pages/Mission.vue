<template>
  <q-page
    class="flex flex-center column"
    padding
  >
    <mission-map
      :starting-x="-168"
      :starting-y="-255"
      :ending-x="0"
      :ending-y="0"
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
import MissionMap from '../components/MissionMap.vue'

export default {
  name: 'Mission',
  components: {
    MissionMap,
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
  },
  async mounted() {
    await this.$store.dispatch(GET_MISSION_ACTION, this.$route.params.id)
    this.loadingIsVisible = false
  }
}
</script>
