<template>
  <q-item
    bordered
    clickable
    v-ripple
  >
    <q-item-section avatar>
      <q-avatar
        v-if="mission.created_by === null"
        color="primary"
        text-color="white"
        icon="face"
      >
        <q-tooltip>Anonymous Public Mission</q-tooltip>
      </q-avatar>
      <q-avatar
        v-else
        rounded
      >
        <img :src="getMissionImageFromUid(mission)">
        <q-tooltip>
          Public Mission by {{ getMissionNameFromUid(mission) }}
        </q-tooltip>
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ mission.title }}</q-item-label>
      <q-item-label
        caption
        lines="1"
      >
        {{ this.missionType(mission.mission_type_id) }} due on {{ mission.complete_by_date }}
      </q-item-label>
      <q-item-label
        caption
        lines="1"
      >
        {{ missionStarting }} to {{ missionDestination }}
      </q-item-label>
    </q-item-section>

    <q-item-section
      side
      top
      class="row justify-center"
    >
      <q-item-label class="text-weight-bold text-h6">
        <q-icon name="attach_money" />{{ formatPrice(mission.pay) }}
      </q-item-label>
      <q-badge
        :label="mission.status"
        :color="statusColors[mission.status]"
        class="q-mt-sm"
      />
    </q-item-section>
  </q-item>
</template>

<style>
</style>

<script>
import { mapGetters, mapState } from 'vuex'
import { formatPrice } from '../utils'
import {
  BOARD_IMAGE_URL_GETTER,
  BOARD_NAME_GETTER,
  USER_IMAGE_URL_GETTER,
  USER_NAME_GETTER,
} from '../store'

export default {
  name: 'MissionsRow',
  props: {
    mission: {
      type: Object,
      required: true
    }
  },
  methods: {
    missionType(typeId) {
      return this.$store.state.missionTypes.find(type => type.uid === typeId).name
    },
    getMissionImageFromUid(mission) {
      if (mission.origin_board_id) {
        return this.BOARD_IMAGE_URL_GETTER(mission.origin_board_id)
      }
      return this.USER_IMAGE_URL_GETTER(mission.created_by)
    },
    getMissionNameFromUid(mission) {
      if (mission.origin_board_id) {
        return this.BOARD_NAME_GETTER(mission.origin_board_id)
      }
      return this.USER_NAME_GETTER(mission.created_by)
    },
    formatPrice
  },
  computed: {
    ...mapGetters([
      BOARD_IMAGE_URL_GETTER,
      BOARD_NAME_GETTER,
      USER_IMAGE_URL_GETTER,
      USER_NAME_GETTER,
    ]),
    ...mapState(['statusColors']),
    missionDestination() {
      return this.mission.ending_system_name ? this.mission.ending_system_name : 'secret location'
    },
    missionStarting() {
      return this.mission.starting_system_name ? this.mission.starting_system_name : 'secret location'
    }
  },
}
</script>
