<template>
  <q-page class="row">
    <missions-list
      class="col"
      :missions="publicMissions"
    />
    <missions-map
      v-if="!$q.platform.is.mobile"
      :key="mapRerenderFlag"
      class="col-8"
      :missions="publicMissions"
    />
  </q-page>
</template>

<style>
</style>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import MissionsList from '../components/MissionsList.vue'
import MissionsMap from '../components/MissionsMap.vue'
import { PUBLIC_MISSIONS_GETTER } from '../store'

export default {
  name: 'Public',
  components: {
    MissionsList,
    MissionsMap,
  },
  data() {
    return {
      publicMissions: [],
      mapRerenderFlag: 0,
    }
  },
  computed: {
    ...mapState([
      'missions'
    ])
  },
  methods: {
    forceMapRerender() {
      this.mapRerenderFlag += 1
    }
  },
  watch: {
    missions: {
      immediate: true,
      handler(newVal, oldVal) {
        Vue.set(this, 'publicMissions', [ ...this.$store.getters[PUBLIC_MISSIONS_GETTER] ])
        this.forceMapRerender()
      }
    }
  }
}
</script>
