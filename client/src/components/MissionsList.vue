<template>
  <div v-if="missions.length > 0">
    <q-list
      v-for="mission of missions"
      :key="mission.uid"
      padding
    >
      <mission-row :mission="mission" />
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
  }
}
</script>
