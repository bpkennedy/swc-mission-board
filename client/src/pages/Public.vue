<template>
  <q-page class="flex flex-center">
    <missions-list :missions="publicMissions" />
  </q-page>
</template>

<style>
</style>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import MissionsList from '../components/MissionsList.vue'
import { PUBLIC_MISSIONS_GETTER } from '../store'

export default {
  name: 'Public',
  components: {
    MissionsList
  },
  data() {
    return {
      publicMissions: [],
    }
  },
  computed: {
    ...mapState([
      'missions'
    ])
  },
  watch: {
    missions: {
      immediate: true,
      handler(newVal, oldVal) {
        Vue.set(this, 'publicMissions', [ ...this.$store.getters[PUBLIC_MISSIONS_GETTER] ])
      }
    }
  }
}
</script>
