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

    <q-card-section>
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
            <div class="q-gutter-md">
              <q-input
                outlined
                v-model="title"
                label="Mission Title *"
                hint="A title/summary of the Mission"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type something']"
              />
              <q-input
                outlined
                type="textarea"
                v-model="description"
                label="Mission Description"
                hint="The details of the Mission"
              />
              <q-select
                outlined
                v-model="missionType"
                :options="MISSION_TYPES_FOR_SELECT_GETTER"
                label="Mission Type"
                hint="The type of Mission"
              />
              <q-input
                outlined
                v-model.number="pay"
                type="number"
                label="Credits Offered"
                hint="Ex. 3000"
              />
              <q-select
                outlined
                v-model="audience"
                :options="audienceOptions"
                label="Audience"
                hint="Public or Private Mission?"
              />
              <q-select
                v-if="audience === 'Private'"
                outlined
                v-model="board"
                :options="BOARDS_FOR_SELECT_GETTER"
                label="Board"
                hint="Which board is this mission for?"
              />
              <q-input
                outlined
                v-model="startByDate"
                label="Mission Start By Date"
                hint="Ex. Y 20 D 301"
              />
              <q-input
                outlined
                v-model="completeByDate"
                label="Mission Complete By Date"
                hint="Ex. Y 20 D 315"
              />
            </div>
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
            <div class="q-gutter-md">
              <q-select
                outlined
                v-model="sector"
                use-input
                clearable
                input-debounce="0"
                @filter="filterSectors"
                :options="filteredSectors"
                behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'"
                label="Starting Sector"
              />
              <q-select
                v-if="sector"
                outlined
                v-model="system"
                use-input
                clearable
                input-debounce="0"
                @filter="filterSystems"
                :options="filteredSystems"
                behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'"
                label="Starting System"
              />
              <q-select
                outlined
                v-model="sectorEnd"
                use-input
                clearable
                input-debounce="0"
                @filter="filterSectorsEnd"
                :options="filteredSectorsEnd"
                behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'"
                label="Destination Sector"
              />
              <q-select
                v-if="sectorEnd"
                outlined
                v-model="systemEnd"
                use-input
                clearable
                input-debounce="0"
                @filter="filterSystemsEnd"
                :options="filteredSystemsEnd"
                behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'"
                label="Destination System"
              />
            </div>
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
          >
            <div class="q-gutter-md">
              <q-item
                tag="label"
                v-ripple
              >
                <q-item-section
                  avatar
                  top
                >
                  <q-toggle v-model="anonymous" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Anonymous?</q-item-label>
                  <q-item-label caption>
                    Anonymous missions allow creators to offer missions without the bidders knowing who is offering the mission. <bold>Note:</bold> This does not prevent the obvious limitations of owning assets and assigning pilot/commander to mission assignees which would reveal your identity. We encourage you to consider a trusted middle when creating anonymous missions that require anonymity.
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                tag="label"
                v-ripple
              >
                <q-item-section
                  avatar
                  top
                >
                  <q-toggle v-model="autoAccept" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Auto-Accept?</q-item-label>
                  <q-item-label caption>
                    Enabling auto-accept will allow mission creators to automatically accept the first bid that is offered for the Mission.
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
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
    </q-card-section>
  </q-card>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import {
  CREATE_MISSION_ACTION,
  BOARDS_FOR_SELECT_GETTER,
  SECTORS_FOR_SELECT_GETTER,
  SECTOR_SYSTEMS_FOR_SELECT_GETTER,
  MISSION_TYPES_FOR_SELECT_GETTER
} from '../store'

export default {
  name: 'NewMission',
  data() {
    return {
      title: null,
      description: null,
      missionType: null,
      pay: null,
      audience: 'Public',
      audienceOptions: ['Public', 'Private'],
      board: null,
      sector: null,
      system: null,
      sectorEnd: null,
      systemEnd: null,
      startByDate: null,
      completeByDate: null,
      anonymous: false,
      autoAccept: false,
      loadingIsVisible: false,
      filteredSectors: [],
      filteredSectorsEnd: [],
      filteredSystems: [],
      filteredSystemsEnd: [],
      step: 1,
    }
  },
  computed: {
    ...mapGetters([
      MISSION_TYPES_FOR_SELECT_GETTER,
      BOARDS_FOR_SELECT_GETTER,
      SECTORS_FOR_SELECT_GETTER,
      SECTOR_SYSTEMS_FOR_SELECT_GETTER,
    ])
  },
  methods: {
    filterSectors(val, update) {
      const filteredSectors = this.filterList(val, SECTORS_FOR_SELECT_GETTER)
      update(() => {
        Vue.set(this, 'filteredSectors', filteredSectors)
      })
    },
    filterSystems(val, update) {
      const filteredSystems = this.filterList(val, SECTOR_SYSTEMS_FOR_SELECT_GETTER, this.sector.value)
      update(() => {
        Vue.set(this, 'filteredSystems', filteredSystems)
      })
    },
    filterSectorsEnd(val, update) {
      const filteredSectors = this.filterList(val, SECTORS_FOR_SELECT_GETTER)
      update(() => {
        Vue.set(this, 'filteredSectorsEnd', filteredSectors)
      })
    },
    filterSystemsEnd(val, update) {
      const filteredSystems = this.filterList(val, SECTOR_SYSTEMS_FOR_SELECT_GETTER, this.sectorEnd.value)
      update(() => {
        Vue.set(this, 'filteredSystemsEnd', filteredSystems)
      })
    },
    filterList(val, getter, resourceUid) {
      const keyword = val.toLowerCase()
      let items = []
      if (resourceUid) {
        items = this[getter](resourceUid)
      } else {
        items = this[getter]
      }
      return items.filter(s => s.label.toLowerCase().indexOf(keyword) > -1)
    },
    async onSubmit () {
      this.loadingIsVisible = true
      await this.$store.dispatch(CREATE_MISSION_ACTION, {
        formData: {
          title: this.title.trim(),
          description: this.description ? this.description.trim() : '',
          pay: this.pay,
          missionType: this.missionType.value,
          audience: this.board ? [this.board.value] : [this.audience],
          startByDate: this.startByDate ? this.startByDate.trim() : '',
          completeByDate: this.completeByDate ? this.completeByDate.trim() : '',
          anonymous: this.anonymous,
          autoAccept: this.autoAccept,
          originBoard: null,
          startingSector: this.sector.value ? this.sector.value : '',
          startingSystem: this.system.value ? this.system.value : '',
          endingSector: this.sectorEnd.value ? this.sectorEnd.value : '',
          endingSystem: this.systemEnd.value ? this.systemEnd.value : '',
        },
        closePopupElement: this.$refs.closeButton.$el,
      })
      this.loadingIsVisible = false
    },
    onReset () {
      Vue.set(this, 'title', null)
      Vue.set(this, 'description', null)
      Vue.set(this, 'pay', null)
      Vue.set(this, 'missionType', null)
      Vue.set(this, 'audience', null)
      Vue.set(this, 'startByDate', null)
      Vue.set(this, 'completeByDate', null)
      Vue.set(this, 'anonymous', false)
      Vue.set(this, 'autoAccept', false)
      Vue.set(this, 'sector', null)
      Vue.set(this, 'system', null)
      Vue.set(this, 'sectorEnd', null)
      Vue.set(this, 'systemEnd', null)
      Vue.set(this, 'filteredSystems', [])
      Vue.set(this, 'filteredSystemsEnd', [])
      Vue.set(this, 'step', 1)
    }
  },
  created() {
    Vue.set(this, 'filteredSectors', this[SECTORS_FOR_SELECT_GETTER])
    Vue.set(this, 'filteredSectorsEnd', this[SECTORS_FOR_SELECT_GETTER])
  },
}
</script>

<style>
</style>
