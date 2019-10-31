<template>
  <div class="fit q-pa-md">
    <q-btn
      v-if="MISSION_IS_BIDDING"
      color="primary"
      text-color="white"
      label="Bid Mission"
      class="full-width q-mb-sm"
      :loading="buttonLoading.bidMission"
      @click="postBid"
    >
      <template v-slot:loading>
        <q-spinner-hourglass class="on-left" />
        Loading...
      </template>
    </q-btn>
    <q-btn
      v-if="userIsContractor && MISSION_IS_PENDING"
      color="primary"
      text-color="white"
      label="Complete Mission"
      class="full-width q-mb-sm"
      :loading="buttonLoading.completeMission"
      @click="completeMission"
    >
      <template v-slot:loading>
        <q-spinner-hourglass class="on-left" />
        Loading...
      </template>
    </q-btn>
    <q-btn
      v-if="userIsContractor && (MISSION_IS_PENDING || MISSION_IS_APPROVING)"
      color="negative"
      text-color="white"
      label="Decline Mission"
      class="full-width q-mb-sm"
      :loading="buttonLoading.declineMission"
      @click="declineClicked = true"
    >
      <template v-slot:loading>
        <q-spinner-hourglass class="on-left" />
        Loading...
      </template>
    </q-btn>
    <q-btn
      v-if="userIsCreator && MISSION_IS_BIDDING && bids.length > 0"
      color="primary"
      text-color="white"
      label="Select Bid"
      class="full-width q-mb-sm"
      :loading="buttonLoading.selectBid"
      @click="selectBidDialog = true"
    >
      <template v-slot:loading>
        <q-spinner-hourglass class="on-left" />
        Loading...
      </template>
    </q-btn>
    <q-btn
      v-if="userIsCreator && MISSION_IS_APPROVING"
      color="primary"
      text-color="white"
      label="Mark Paid"
      class="full-width q-mb-sm"
      :loading="buttonLoading.markPaid"
      @click="markPaidClicked = true"
    >
      <template v-slot:loading>
        <q-spinner-hourglass class="on-left" />
        Loading...
      </template>
    </q-btn>
    <q-btn
      v-if="userIsCreator && (MISSION_IS_BIDDING || MISSION_IS_PENDING || MISSION_IS_APPROVING)"
      color="negative"
      text-color="white"
      label="Withdraw Mission"
      class="full-width q-mb-sm"
      :loading="buttonLoading.withdrawMission"
      @click="withdrawClicked = true"
    >
      <template v-slot:loading>
        <q-spinner-hourglass class="on-left" />
        Loading...
      </template>
    </q-btn>
    <q-btn
      v-if="(userIsCreator || userIsContractor) && MISSION_IS_PAID"
      color="negative"
      text-color="white"
      label="Leave Feedback"
      class="full-width q-mb-sm"
      :loading="buttonLoading.leaveFeedback"
      @click="leaveFeedback"
    >
      <template v-slot:loading>
        <q-spinner-hourglass class="on-left" />
        Loading...
      </template>
    </q-btn>
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
    <confirm
      message="Are you sure you want to withdraw this mission?"
      :show="withdrawClicked"
      @confirm="withdrawMission"
      @cancel="withdrawClicked = false"
    />
    <confirm
      message="Are you sure you want to decline this mission?"
      :show="declineClicked"
      @confirm="declineMission"
      @cancel="declineClicked = false"
    />
    <confirm
      message="By clicking Yes, you are affirming that you have delivered the agreed upon terms of this mission to the contractor. Is this correct?"
      :show="markPaidClicked"
      @confirm="markPaid"
      @cancel="markPaidClicked = false"
    />
  </div>
</template>

<style>
</style>

<script>
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { genericError, genericSuccess } from '../utils'
import Confirm from './Confirm.vue'

import {
  CREATE_BID_ACTION,
  ACCEPT_BID_ACTION,
  WITHDRAW_MISSION_ACTION,
  DECLINE_MISSION_ACTION,
  COMPLETE_MISSION_ACTION,
  MARK_PAID_MISSION_ACTION,
  BIDDERS_FOR_SELECT_GETTER,
  MISSION_IS_BIDDING,
  MISSION_IS_PENDING,
  MISSION_IS_APPROVING,
  MISSION_IS_PAID,
} from '../store'

export default {
  name: 'BidActions',
  components: {
    Confirm,
  },
  data() {
    return {
      selectBidDialog: false,
      selectedBidder: '',
      withdrawClicked: false,
      declineClicked: false,
      markPaidClicked: false,
      buttonLoading: {
        bidMission: false,
        selectBid: false,
        withdrawMission: false,
        declineMission: false,
        completeMission: false,
        markPaid: false,
        leaveFeedback: false,
      }
    }
  },
  methods: {
    clearDialog() {
      Vue.set(this, 'selectBidDialog', false)
      Vue.set(this, 'selectedBidder', '')
    },
    async saveBidder() {
      Vue.set(this.buttonLoading, 'selectBid', true)
      try {
        await this.$store.dispatch(ACCEPT_BID_ACTION, {
          missionId: this.mission.uid,
          bidderId: this.selectedBidder.value,
          bidId: this.selectedBidder.bidId,
        })
        this.genericSuccess(`You accepted ${this.selectedBidder.label}'s bid!`)
      } catch (error) {
        this.genericError('There was an error trying to accept this bid.')
      }
      Vue.set(this.buttonLoading, 'selectBid', false)
    },
    async completeMission() {
      Vue.set(this.buttonLoading, 'completeMission', true)
      try {
        await this.$store.dispatch(COMPLETE_MISSION_ACTION, { missionId: this.mission.uid })
        this.genericSuccess(`NOICE! You completed mission: ${this.mission.title}`)
      } catch (error) {
        this.genericError('There was an error trying to complete this mission.')
      }
      Vue.set(this.buttonLoading, 'completeMission', false)
    },
    async declineMission() {
      Vue.set(this.buttonLoading, 'declineMission', true)
      Vue.set(this, 'declineClicked', false)
      try {
        await this.$store.dispatch(DECLINE_MISSION_ACTION, { missionId: this.mission.uid })
        this.genericSuccess(`You declined mission: ${this.mission.title}.`)
      } catch (error) {
        this.genericError('There was an error trying to decline this mission.')
      }
      Vue.set(this.buttonLoading, 'declineMission', false)
    },
    async withdrawMission() {
      Vue.set(this.buttonLoading, 'withdrawMission', true)
      Vue.set(this, 'withdrawClicked', false)
      try {
        await this.$store.dispatch(WITHDRAW_MISSION_ACTION, { missionId: this.mission.uid })
        this.genericSuccess(`You withdrew mission: ${this.mission.title}.`)
      } catch (error) {
        this.genericError('There was an error trying to withdraw this mission.')
      }
      Vue.set(this.buttonLoading, 'withdrawMission', false)
    },
    async markPaid() {
      Vue.set(this.buttonLoading, 'markPaid', true)
      Vue.set(this, 'markPaidClicked', false)
      try {
        await this.$store.dispatch(MARK_PAID_MISSION_ACTION, { missionId: this.mission.uid })
        this.genericSuccess(`You marked paid mission: ${this.mission.title}.`)
      } catch (error) {
        this.genericError('There was an error trying to mark paid this mission.')
      }
      Vue.set(this.buttonLoading, 'markPaid', false)
    },
    async leaveFeedback() {},
    async postBid() {
      if (this.validateCanBid) {
        this.genericError('You already bid on this mission.')
        return
      }
      Vue.set(this.buttonLoading, 'bidMission', true)
      try {
        await this.$store.dispatch(CREATE_BID_ACTION, {
          missionId: this.mission.uid,
          bidderId: this.user.uid,
        })
        this.genericSuccess(`You bid on the mission: ${this.mission.title}.`)
      } catch (error) {
        this.genericError('There was an error trying to create your bid.')
      }
      Vue.set(this.buttonLoading, 'bidMission', false)
    },
    genericError,
    genericSuccess,
  },
  computed: {
    ...mapState([
      'bids',
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
      return this.bids.find(bid => bid.bidder_id === this.user.uid)
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
