<template>
  <div class="fit q-pa-md">
    <q-btn
      v-if="userIsContractor && MISSION_IS_BIDDING"
      color="primary"
      text-color="white"
      label="Bid Mission"
      class="full-width q-mb-sm"
      @click="postBid"
    />
    <q-btn
      v-if="userIsContractor && MISSION_IS_BIDDING"
      color="primary"
      text-color="white"
      label="Complete Mission"
      class="full-width q-mb-sm"
      @click="completeMission"
    />
    <q-btn
      v-if="userIsContractor && (MISSION_IS_PENDING || MISSION_IS_APPROVING)"
      color="negative"
      text-color="white"
      label="Decline Mission"
      class="full-width q-mb-sm"
      @click="declineMission"
    />
    <q-btn
      v-if="userIsCreator && MISSION_IS_BIDDING"
      color="primary"
      text-color="white"
      label="Select Bid"
      class="full-width q-mb-sm"
      @click="selectBidDialog = true"
    />
    <q-btn
      v-if="userIsCreator && MISSION_IS_APPROVING"
      color="primary"
      text-color="white"
      label="Mark Paid"
      class="full-width q-mb-sm"
      @click="markPaid"
    />
    <q-btn
      v-if="userIsCreator && (MISSION_IS_BIDDING || MISSION_IS_PENDING || MISSION_IS_APPROVING)"
      color="negative"
      text-color="white"
      label="Withdraw Mission"
      class="full-width q-mb-sm"
      @click="withdrawMission"
    />
    <q-btn
      v-if="(userIsCreator || userIsContractor) && MISSION_IS_PAID"
      color="negative"
      text-color="white"
      label="Withdraw Mission"
      class="full-width q-mb-sm"
      @click="leaveFeedback"
    />
    <q-dialog
      v-model="selectBidDialog"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">
            Accept Bid
          </div>
        </q-card-section>

        <q-card-section>
          <q-select
            outlined
            v-model="selectedBidder"
            :options="BIDDERS_FOR_SELECT_GETTER"
            label="Bidder"
            hint="Select bidder for this mission"
          />
        </q-card-section>

        <q-card-actions
          class="text-primary"
        >
          <q-btn
            flat
            align="left"
            label="Cancel"
            @click="clearDialog"
            v-close-popup
          />
          <q-btn
            flat
            align="right"
            label="Submit"
            @click="saveBidder"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style>
</style>

<script>
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { genericError, genericSuccess } from '../utils'

import {
  CREATE_BID_ACTION,
  BIDDERS_FOR_SELECT_GETTER,
  MISSION_IS_BIDDING,
  MISSION_IS_PENDING,
  MISSION_IS_APPROVING,
  MISSION_IS_PAID,
} from '../store'

export default {
  name: 'BidActions',
  data() {
    return {
      selectBidDialog: false,
      selectedBidder: '',
    }
  },
  methods: {
    clearDialog() {
      Vue.set(this, 'selectBidDialog', false)
      Vue.set(this, 'selectedBidder', '')
    },
    async saveBidder() {},
    async completeMission() {},
    async declineMission() {},
    async withdrawMission() {},
    async markPaid() {},
    async leaveFeedback() {},
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
      'user',
      'mission',
    ]),
    ...mapGetters([
      BIDDERS_FOR_SELECT_GETTER,
      MISSION_IS_BIDDING,
      MISSION_IS_PENDING,
      MISSION_IS_APPROVING,
      MISSION_IS_PAID,
    ]),
    validateCanBid() {
      return this.bidders.find(bidder => bidder.bidder_id === this.user.uid)
    },
    userIsCreator() {
      return this.mission.created_by === this.user.uid
    },
    userIsContractor() {
      return this.mission.contractor_id === this.user.uid
    }
  }
}
</script>
