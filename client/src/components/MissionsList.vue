<template>
  <q-list
    padding
  >
    <q-scroll-area
      v-if="missions.length > 0"
      style="height: 100%;"
    >
      <mission-row
        v-for="mission of missions"
        :key="mission.uid"
        :mission="mission"
        @click.native="goToMission(mission.uid)"
      />
    </q-scroll-area>
  </q-list>
</template>

<style>
</style>

<script>
import MissionRow from '../components/MissionRow.vue'

export default {
  name: 'MissionsList',
  components: {
    MissionRow,
  },
  props: {
    missions: {
      type: Array,
      required: true
    }
  },
  methods: {
    goToMission(id) {
      this.$router.push({
        name: 'mission',
        params: {
          id,
        },
      })
    }
  }
}
</script>
