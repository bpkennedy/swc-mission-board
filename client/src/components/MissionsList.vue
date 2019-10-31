<template>
  <q-list>
    <q-scroll-area
      v-if="missions.length > 0"
      style="height: 100%;"
    >
      <q-item>
        <q-input
          borderless
          :dense="true"
          v-model="searchText"
          @keydown.esc="clearSearch($event)"
          label="Mission Title Search"
          style="width:100%;"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
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
              @click="changeFilterType('All')"
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
              @click="changeFilterType('Working')"
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
              @click="changeFilterType('Created')"
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
      searchText: '',
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
    changeFilterType(type) {
      this.$store.dispatch(SET_MISSION_FILTER_LABEL_ACTION, type)
    },
    filterMissionsByTypeAndKeyword() {
      let updatedFilteredMissions = [ ...this.missions ]
      if (this.filterLabel === 'Working') {
        updatedFilteredMissions = this.missions.filter(m => m.contractor_id === this.user.uid)
      } else if (this.filterLabel === 'Created') {
        updatedFilteredMissions = this.missions.filter(m => m.created_by === this.user.uid)
      }
      if (this.searchText.length === 0) {
        Vue.set(this, 'filteredMissions', [ ...updatedFilteredMissions ])
      } else {
        const filteredMissionsByKeyword = updatedFilteredMissions.filter(m => {
          return m.title.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1
        })
        Vue.set(this, 'filteredMissions', [ ...filteredMissionsByKeyword ])
      }
    },
    clearSearch($event) {
      Vue.set(this, 'searchText', '')
      $event.target.blur()
    }
  },
  computed: {
    ...mapState([
      'user',
      'filterLabel',
    ]),
  },
  watch: {
    missions: {
      immediate: true,
      handler() {
        this.changeFilterType(this.filterLabel)
        this.filterMissionsByTypeAndKeyword()
      },
    },
    filterLabel() {
      this.filterMissionsByTypeAndKeyword()
    },
    searchText() {
      this.filterMissionsByTypeAndKeyword()
    }
  }
}
</script>

<style lang="stylus">
  .q-btn-dropdown__arrow-container {
    display: none!important;
  }
</style>
