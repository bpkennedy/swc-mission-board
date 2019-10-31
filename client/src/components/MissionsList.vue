<template>
  <q-list>
    <q-scroll-area
      v-if="missions.length > 0"
      style="height: 100%;"
    >
      <q-item>
        <q-space />
        <q-btn-dropdown
          color="white"
          text-color="black"
        >
          <template v-slot:label>
            <div class="row items-center no-wrap">
              <div class="text-center">
                {{ filterLabel }}
              </div>
              <q-icon
                right
                name="filter_list"
              />
            </div>
          </template>
          <q-list>
            <q-item
              clickable
              v-close-popup
              @click="filterMissionsBy('All')"
            >
              <q-item-section>
                <q-item-label>
                  All
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click="filterMissionsBy('Working')"
            >
              <q-item-section>
                <q-item-label>
                  Working
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click="filterMissionsBy('Created')"
            >
              <q-item-section>
                <q-item-label>
                  Created
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-item>
      <q-separator />
      <mission-row
        v-for="mission of filteredMissions"
        :key="mission.uid"
        :mission="mission"
        @click.native="goToMission(mission.uid)"
      />
    </q-scroll-area>
  </q-list>
</template>

<style>
</style>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import MissionRow from '../components/MissionRow.vue'
import { SET_MISSION_FILTER_LABEL_ACTION } from '../store'

export default {
  name: 'MissionsList',
  components: {
    MissionRow,
  },
  props: {
    missions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      filteredMissions: [],
    }
  },
  methods: {
    goToMission(id) {
      this.$router.push({
        name: 'mission',
        params: {
          id,
        },
      })
    },
    filterMissionsBy(type) {
      if (type === 'Working') {
        const missionsContracting = this.missions.filter(m => m.contractor_id === this.user.uid)
        Vue.set(this, 'filteredMissions', [ ...missionsContracting ])
        this.$store.dispatch(SET_MISSION_FILTER_LABEL_ACTION, 'Working')
      } else if (type === 'Created') {
        const missionsCreated = this.missions.filter(m => m.created_by === this.user.uid)
        Vue.set(this, 'filteredMissions', [ ...missionsCreated ])
        this.$store.dispatch(SET_MISSION_FILTER_LABEL_ACTION, 'Created')
      } else {
        Vue.set(this, 'filteredMissions', [ ...this.missions ])
        this.$store.dispatch(SET_MISSION_FILTER_LABEL_ACTION, 'All')
      }
    }
  },
  computed: {
    ...mapState([
      'user',
      'filterLabel',
    ])
  },
  watch: {
    missions: {
      immediate: true,
      handler() {
        this.filterMissionsBy(this.filterLabel)
      },
    }
  }
}
</script>

<style lang="stylus">
  .q-btn-dropdown__arrow-container {
    display: none!important;
  }
</style>
