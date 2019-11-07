<template>
  <q-stepper
    v-model="step"
    vertical
    color="primary"
    flat
    class="progress-stepper"
  >
    <q-step
      :name="1"
      title="Bidding"
      icon="confirmation_number"
      active-icon="confirmation_number"
      done-icon="confirmation_number"
      done-color="green-6"
      :done="step > 1"
    />
    <q-step
      :name="2"
      title="In Progress"
      icon="flight"
      active-icon="flight"
      done-icon="flight"
      done-color="green-6"
      :done="step > 2"
    />
    <q-step
      :name="3"
      title="Approving"
      icon="thumb_up"
      active-icon="thumb_up"
      done-icon="thumb_up"
      done-color="green-6"
      :done="step > 3"
    />
    <q-step
      :name="4"
      title="Paying Out"
      icon="attach_money"
      active-icon="attach_money"
      active-color="green-6"
      done-icon="attach_money"
      done-color="green-6"
      :done="step > 4"
    />
  </q-stepper>
</template>

<style lang="stylus">
.progress-stepper.q-stepper--vertical {
  padding: 0;
  .q-stepper__step-inner {
    padding:0;
  }
}
</style>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import {
  AVAILABLE_KEY,
  BIDDING_KEY,
  PENDING_KEY,
  APPROVING_KEY,
  PAYING_OUT_KEY,
} from '../constants'

const statusTypes = {
  [AVAILABLE_KEY]: 1,
  [BIDDING_KEY]: 1,
  [PENDING_KEY]: 2,
  [APPROVING_KEY]: 3,
  [PAYING_OUT_KEY]: 4,
}

export default {
  name: 'MissionProgress',
  data() {
    return {
      step: 0
    }
  },
  computed: {
    ...mapState([
      'mission',
    ])
  },
  watch: {
    mission: {
      immediate: true,
      handler() {
        if (this.mission.status) {
          Vue.set(this, 'step', statusTypes[this.mission.status])
        }
      }
    }
  }
}
</script>
