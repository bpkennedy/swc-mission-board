<template>
  <div class="q-gutter-md">
    <q-item
      tag="label"
      v-ripple
    >
      <q-item-section
        avatar
        top
      >
        <q-toggle v-model="customStartingCoords" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Custom Starting Coordinates?</q-item-label>
        <q-item-label caption>
          Custom X,Y coordinates for starting location
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-select
      outlined
      v-model="value.sector"
      v-if="!customStartingCoords"
      use-input
      clearable
      input-debounce="0"
      @filter="filterSectors"
      :options="filteredSectors"
      behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'"
      label="Starting Sector"
    />
    <q-select
      v-if="value.sector && !customStartingCoords"
      outlined
      v-model="value.system"
      use-input
      clearable
      input-debounce="0"
      @filter="filterSystems"
      :options="filteredSystems"
      behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'"
      label="Starting System"
    />
    <div
      v-if="customStartingCoords"
      class="row"
    >
      <q-input
        outlined
        v-model.number="value.customStartingX"
        type="number"
        label="Starting X"
        class="q-mr-md"
      />
      <q-input
        outlined
        v-model.number="value.customStartingY"
        type="number"
        label="Starting Y"
      />
    </div>
    <q-item
      tag="label"
      v-ripple
    >
      <q-item-section
        avatar
        top
      >
        <q-toggle v-model="customEndingCoords" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Custom Destination Coordinates?</q-item-label>
        <q-item-label caption>
          Custom X,Y coordinates for destination location
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-select
      outlined
      v-model="value.sectorEnd"
      v-if="!customEndingCoords"
      use-input
      clearable
      input-debounce="0"
      @filter="filterSectorsEnd"
      :options="filteredSectorsEnd"
      behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'"
      label="Destination Sector"
    />
    <q-select
      v-if="value.sectorEnd && !customEndingCoords"
      outlined
      v-model="value.systemEnd"
      use-input
      clearable
      input-debounce="0"
      @filter="filterSystemsEnd"
      :options="filteredSystemsEnd"
      behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'"
      label="Destination System"
    />
    <div
      v-if="customEndingCoords"
      class="row"
    >
      <q-input
        outlined
        v-model.number="value.customEndingX"
        type="number"
        label="Destination X"
        class="q-mr-md"
      />
      <q-input
        outlined
        v-model.number="value.customEndingY"
        type="number"
        label="Destination Y"
      />
    </div>
  </div>
</template>

<style>
</style>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import {
  SECTORS_FOR_SELECT_GETTER,
  SECTOR_SYSTEMS_FOR_SELECT_GETTER,
  NEW_MISSION_FORM_RESET_EVENT,
} from '../store'

export default {
  name: 'LocationDetails',
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      customStartingCoords: false,
      customEndingCoords: false,
      filteredSectors: [],
      filteredSectorsEnd: [],
      filteredSystems: [],
      filteredSystemsEnd: [],
    }
  },
  computed: {
    ...mapGetters([
      SECTORS_FOR_SELECT_GETTER,
      SECTOR_SYSTEMS_FOR_SELECT_GETTER,
    ])
  },
  methods: {
    filterSectors(val, update) {
      const filteredSectors = this.filterList(val, SECTORS_FOR_SELECT_GETTER)
      this.updateOptions(update, 'filteredSectors', filteredSectors)
    },
    filterSectorsEnd(val, update) {
      const filteredSectors = this.filterList(val, SECTORS_FOR_SELECT_GETTER)
      this.updateOptions(update, 'filteredSectorsEnd', filteredSectors)
    },
    filterSystems(val, update) {
      const filteredSystems = this.filterList(val, SECTOR_SYSTEMS_FOR_SELECT_GETTER, this.value.sector.value)
      this.updateOptions(update, 'filteredSystems', filteredSystems)
    },
    filterSystemsEnd(val, update) {
      const filteredSystems = this.filterList(val, SECTOR_SYSTEMS_FOR_SELECT_GETTER, this.value.sectorEnd.value)
      this.updateOptions(update, 'filteredSystemsEnd', filteredSystems)
    },
    updateOptions(quasarFilterUpdate, modelName, data) {
      quasarFilterUpdate(() => {
        Vue.set(this, modelName, data)
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
    reset() {
      Vue.set(this, 'filteredSystems', [])
      Vue.set(this, 'filteredSystemsEnd', [])
    }
  },
  watch: {
    value() {
      this.$emit('input', this.value)
    },
    customStartingCoords() {
      Vue.set(this.value, 'customStartingX', null)
      Vue.set(this.value, 'customStartingY', null)
      Vue.set(this.value, 'sector', null)
      Vue.set(this.value, 'system', null)
    },
    customEndingCoords() {
      Vue.set(this.value, 'customEndingX', null)
      Vue.set(this.value, 'customEndingY', null)
      Vue.set(this.value, 'sectorEnd', null)
      Vue.set(this.value, 'systemEnd', null)
    }
  },
  created() {
    Vue.set(this, 'filteredSectors', this[SECTORS_FOR_SELECT_GETTER])
    Vue.set(this, 'filteredSectorsEnd', this[SECTORS_FOR_SELECT_GETTER])
  },
  mounted() {
    this.$root.$on(NEW_MISSION_FORM_RESET_EVENT, this.reset())
  },
  beforeDestroy () {
    this.$root.$off(NEW_MISSION_FORM_RESET_EVENT)
  }
}
</script>
