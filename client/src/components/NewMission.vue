<template>
  <q-card class="bg-white text-black">
    <q-bar class="bg-primary text-white">
      <q-space />
      <q-btn
        dense
        flat
        icon="close"
        ref="closeButton"
        v-close-popup
      >
        <q-tooltip>
          Close
        </q-tooltip>
      </q-btn>
    </q-bar>

    <q-card-section>
      <div class="text-h6">
        Create New Mission
      </div>
    </q-card-section>

    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <q-stepper
        v-model="step"
        vertical
        color="primary"
        animated
      >
        <q-step
          :name="1"
          title="Mission Parameters"
          icon="settings"
          :done="step > 1"
        >
          <mission-details
            v-model="missionDetails"
            @input="updateLocalModelFromInputEvent('missionDetails', eventData)"
          />
          <q-stepper-navigation>
            <q-btn
              @click="step = 2"
              color="primary"
              label="Continue"
            />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="2"
          title="Location Details"
          icon="create_new_folder"
          :done="step > 2"
        >
          <location-details
            :value="locationDetails"
            @input="updateLocalModelFromInputEvent('locationDetails', eventData)"
          />
          <q-stepper-navigation>
            <q-btn
              @click="step = 3"
              color="primary"
              label="Continue"
            />
            <q-btn
              flat
              @click="step = 1"
              color="primary"
              label="Back"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="3"
          title="Permission Settings"
          icon="assignment"
          :done="step > 3"
        >
          <permission-details
            :value="permissionDetails"
            @input="updateLocalModelFromInputEvent('permissionDetails', eventData)"
          />
          <q-stepper-navigation>
            <q-btn
              @click="step = 4"
              color="primary"
              label="Continue"
            />
            <q-btn
              flat
              @click="step = 2"
              color="primary"
              label="Back"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="4"
          title="Confirm Mission"
          icon="add_comment"
        >
          Everything correct?
          <q-stepper-navigation>
            <q-btn
              label="Finish"
              type="submit"
              color="primary"
            />
            <q-btn
              label="Reset"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
            />
            <q-btn
              flat
              @click="step = 3"
              color="primary"
              label="Back"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
      <q-inner-loading
        :showing="loadingIsVisible"
        transition-show="fade"
        transition-hide="fade"
      >
        <q-spinner-pie
          size="4em"
          color="primary"
        />
      </q-inner-loading>
    </q-form>
  </q-card>
</template>

<script>
import Vue from 'vue'
import {
  CREATE_MISSION_ACTION,
  NEW_MISSION_FORM_RESET_EVENT,
} from '../store'
import MissionDetails from './MissionDetails.vue'
import LocationDetails from './LocationDetails.vue'
import PermissionDetails from './PermissionDetails.vue'

export default {
  name: 'NewMission',
  components: {
    MissionDetails,
    LocationDetails,
    PermissionDetails,
  },
  data() {
    return {
      missionDetails: {
        title: null,
        description: null,
        missionType: null,
        pay: null,
        audience: 'Public',
        board: null,
        startByDate: null,
        completeByDate: null,
      },
      locationDetails: {
        sector: null,
        system: null,
        sectorEnd: null,
        systemEnd: null,
      },
      permissionDetails: {
        anonymous: false,
        autoAccept: false,
      },
      loadingIsVisible: false,
      step: 1,
    }
  },
  methods: {
    updateLocalModelFromInputEvent(modelName, eventData) {
      Vue.set(this, modelName, eventData)
    },
    async onSubmit () {
      this.loadingIsVisible = true
      await this.$store.dispatch(CREATE_MISSION_ACTION, {
        formData: {
          title: this.missionDetails.title.trim(),
          description: this.missionDetails.description ? this.missionDetails.description.trim() : '',
          pay: this.missionDetails.pay ? this.missionDetails.pay : 0,
          missionType: this.missionDetails.missionType.value,
          audience: this.missionDetails.board ? [this.missionDetails.board.value] : [this.missionDetails.audience],
          startByDate: this.missionDetails.startByDate ? this.missionDetails.startByDate.trim() : '',
          completeByDate: this.missionDetails.completeByDate ? this.missionDetails.completeByDate.trim() : '',
          startingSector: this.locationDetails.sector ? this.locationDetails.sector.value : '',
          startingSystem: this.locationDetails.system ? this.locationDetails.system.value : '',
          endingSector: this.locationDetails.sectorEnd ? this.locationDetails.sectorEnd.value : '',
          endingSystem: this.locationDetails.systemEnd ? this.locationDetails.systemEnd.value : '',
          anonymous: this.permissionDetails.anonymous,
          autoAccept: this.permissionDetails.autoAccept,
          originBoard: null,
        },
        closePopupElement: this.$refs.closeButton.$el,
      })
      this.loadingIsVisible = false
    },
    onReset () {
      this.$root.$emit(NEW_MISSION_FORM_RESET_EVENT)
      Vue.set(this.missionDetails, 'title', null)
      Vue.set(this.missionDetails, 'description', null)
      Vue.set(this.missionDetails, 'pay', null)
      Vue.set(this.missionDetails, 'missionType', null)
      Vue.set(this.missionDetails, 'audience', null)
      Vue.set(this.missionDetails, 'startByDate', null)
      Vue.set(this.missionDetails, 'completeByDate', null)
      Vue.set(this.locationDetails, 'sector', null)
      Vue.set(this.locationDetails, 'system', null)
      Vue.set(this.locationDetails, 'sectorEnd', null)
      Vue.set(this.locationDetails, 'systemEnd', null)
      Vue.set(this.permissionDetails, 'anonymous', false)
      Vue.set(this.permissionDetails, 'autoAccept', false)
      Vue.set(this, 'step', 1)
    }
  },
}
</script>

<style>
</style>
