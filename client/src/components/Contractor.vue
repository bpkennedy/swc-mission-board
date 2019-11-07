<template>
  <div>
    <q-item-label
      header
    >
      {{ contractorAssignmentLabel }}
    </q-item-label>
    <q-item
      clickable
      v-ripple
    >
      <q-item-section avatar>
        <q-avatar v-if="USER_IMAGE_URL_GETTER(mission.contractor_id)">
          <img :src="USER_IMAGE_URL_GETTER(mission.contractor_id)">
        </q-avatar>
        <q-avatar
          v-else
          color="info"
          text-color="white"
          icon="person"
        />
      </q-item-section>
      <q-item-section v-if="USER_NAME_GETTER(mission.contractor_id)">
        {{ USER_NAME_GETTER(mission.contractor_id) }}
      </q-item-section>
      <q-item-section
        v-else
        class="text-italic"
      >
        User Deleted
      </q-item-section>
    </q-item>
    <q-separator />
  </div>
</template>

<style>
</style>

<script>
import { mapState, mapGetters } from 'vuex'

import {
  USER_IMAGE_URL_GETTER,
  USER_NAME_GETTER,
  MISSION_IS_PAID,
} from '../store'

export default {
  name: 'Contractor',
  computed: {
    ...mapState([
      'mission',
    ]),
    ...mapGetters([
      USER_IMAGE_URL_GETTER,
      USER_NAME_GETTER,
      MISSION_IS_PAID,
    ]),
    contractorAssignmentLabel() {
      return this.MISSION_IS_PAID ? 'Completed By' : 'Assigned Contractor'
    },
  }
}
</script>
