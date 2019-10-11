<template>
  <q-list v-if="display === 'column'">
    <q-scroll-area style="height: 100%;">
      <q-item-label header>
        Status
      </q-item-label>
      <mission-progress :mission="mission" />
      <q-separator spaced />
      <q-item-label header>
        Location
      </q-item-label>
      <q-item>
        <q-item-section>
          <q-item-label>
            Starting System
          </q-item-label>
          <q-item-label caption>
            {{ mission.startingSystemName }} ({{ mission.startingX }}, {{ mission.startingY }})
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>
            Destination System
          </q-item-label>
          <q-item-label caption>
            {{ mission.endingSystemName }} ({{ mission.endingX }}, {{ mission.endingY }})
          </q-item-label>
        </q-item-section>
      </q-item>
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

export default {
  name: 'MissionMetadata',
  components: {
    MissionProgress,
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
  },
}
</script>
