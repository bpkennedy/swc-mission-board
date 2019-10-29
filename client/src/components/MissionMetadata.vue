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
      <q-item-label header>
        Bidders
      </q-item-label>
      <q-item
        v-for="bidder of bidders"
        :key="bidder.bidder_id"
        clickable
        v-ripple
      >
        <q-item-section avatar>
          <q-avatar>
            <img :src="USER_IMAGE_URL_GETTER(bidder.bidder_id)">
          </q-avatar>
        </q-item-section>
        <q-item-section>{{ USER_NAME_GETTER(bidder.bidder_id) }}</q-item-section>
      </q-item>
      <div class="fit q-pa-md">
        <q-btn
          color="primary"
          text-color="white"
          label="Bid Mission"
          class="full-width"
          @click="postBid"
        />
      </div>
    </q-scroll-area>
  </q-list>
  <q-card v-else>
    test card area.
  </q-card>
</template>

<style>
</style>

<script>
import { mapState, mapGetters } from 'vuex'
import { genericError, genericSuccess } from '../utils'
import MissionProgress from './MissionProgress.vue'
import {
  USER_IMAGE_URL_GETTER,
  USER_NAME_GETTER,
  CREATE_BID_ACTION,
} from '../store'

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
  methods: {
    async postBid() {
      if (this.validateCanBid) {
        this.genericError('You already bid on this mission.')
        return
      }
      try {
        await this.$store.dispatch(CREATE_BID_ACTION, {
          missionId: this.mission.uid,
          bidderId: this.user.uid,
        })
        this.genericSuccess(`You bid on the mission: ${this.mission.title}.`)
      } catch (error) {
        this.genericError('There was an error trying to create your bid.')
      }
    },
    genericError,
    genericSuccess,
  },
  computed: {
    ...mapState([
      'bidders',
      'user'
    ]),
    ...mapGetters([
      USER_IMAGE_URL_GETTER,
      USER_NAME_GETTER,
    ]),
    validateCanBid() {
      return this.bidders.find(bidder => bidder.bidder_id === this.user.uid)
    },
  }
}
</script>
