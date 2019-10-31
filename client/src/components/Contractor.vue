<template>
  <div>
    <q-item-label
      header
      class="text-weight-bold text-body1"
    >
      Assigned Contractor
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
    ])
  }
}
</script>
