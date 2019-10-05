<template>
  <div v-if="missions.length > 0">
    <q-list
      v-for="mission of missions"
      :key="mission.uid"
      padding
    >
      <mission-row
        :mission="mission"
        @click.native="goToMission(mission.uid)"
      />
    </q-list>
  </div>
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
