<template>
  <q-page class="row">
    <missions-list
      class="col"
      :missions="myLocalMissions"
    />
    <missions-map
      v-if="!$q.platform.is.mobile"
      :key="mapRerenderFlag"
      class="col-8"
      :missions="myLocalMissions"
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

export default {
  name: 'MyMissions',
  components: {
    MissionsList,
    MissionsMap,
  },
  data() {
    return {
      myLocalMissions: [],
      mapRerenderFlag: 0,
    }
  },
  computed: {
    ...mapState([
      'myMissions'
    ]),
  },
  methods: {
    forceMapRerender() {
      this.mapRerenderFlag += 1
    }
  },
  watch: {
    myMissions: {
      immediate: true,
      handler(newVal, oldVal) {
        Vue.set(this, 'myLocalMissions', [ ...this.myMissions ])
        this.forceMapRerender()
      }
    }
  }
}
</script>
