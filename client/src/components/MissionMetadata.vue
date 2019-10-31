<template>
  <q-list
    v-if="display === 'column'"
    bordered
    class="no-top-border"
  >
    <q-scroll-area style="height: 100%;">
      <contractor v-if="MISSION_IS_PENDING || MISSION_IS_APPROVING || MISSION_IS_PAID" />
      <q-item-label header>
        Status
      </q-item-label>
      <mission-progress />
      <q-separator spaced />
      <bidders v-if="MISSION_IS_BIDDING" />
      <bid-actions />
    </q-scroll-area>
  </q-list>
  <q-card v-else>
    test card area.
  </q-card>
</template>

<style>
</style>

<script>
import { mapGetters } from 'vuex'
import MissionProgress from './MissionProgress.vue'
import Bidders from './Bidders.vue'
import BidActions from './BidActions.vue'
import Contractor from './Contractor.vue'

import {
  MISSION_IS_BIDDING,
  MISSION_IS_PENDING,
  MISSION_IS_APPROVING,
  MISSION_IS_PAID,
} from '../store'

export default {
  name: 'MissionMetadata',
  components: {
    MissionProgress,
    Bidders,
    BidActions,
    Contractor,
  },
  props: {
    display: {
      type: String,
      default: 'column'
    }
  },
  computed: {
    ...mapGetters([
      MISSION_IS_BIDDING,
      MISSION_IS_PENDING,
      MISSION_IS_APPROVING,
      MISSION_IS_PAID,
    ])
  }
}
</script>
