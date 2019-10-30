<template>
  <q-list
    v-if="display === 'column'"
    bordered
    class="no-top-border"
  >
    <q-scroll-area style="height: 100%;">
      <q-item-label header>
        Status
      </q-item-label>
      <mission-progress :mission="mission" />
      <q-separator spaced />
      <bidders />
    </q-scroll-area>
  </q-list>
  <q-card v-else>
    test card area.
  </q-card>
</template>

<style>
</style>

<script>
import MissionProgress from './MissionProgress.vue'
import Bidders from './Bidders.vue'

export default {
  name: 'MissionMetadata',
  components: {
    MissionProgress,
    Bidders,
  },
  props: {
    mission: {
      type: Object,
      required: true
    },
    display: {
      type: String,
      default: 'column'
    }
  }
}
</script>
