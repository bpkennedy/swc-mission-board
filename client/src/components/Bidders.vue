<template>
  <div>
    <q-item-label header>
      Bidders
    </q-item-label>
    <q-item
      v-for="bid of bids"
      :key="bid.bidder_id"
      clickable
      v-ripple
    >
      <q-item-section avatar>
        <q-avatar v-if="USER_IMAGE_URL_GETTER(bid.bidder_id)">
          <img :src="USER_IMAGE_URL_GETTER(bid.bidder_id)">
        </q-avatar>
        <q-avatar
          v-else
          color="info"
          text-color="white"
          icon="person"
        />
      </q-item-section>
      <q-item-section v-if="USER_NAME_GETTER(bid.bidder_id)">
        {{ USER_NAME_GETTER(bid.bidder_id) }}
      </q-item-section>
      <q-item-section
        v-else
        class="text-italic"
      >
        User Deleted
      </q-item-section>
    </q-item>
    <bid-actions />
  </div>
</template>

<style>
</style>

<script>
import { mapState, mapGetters } from 'vuex'
import BidActions from './BidActions.vue'

import {
  USER_IMAGE_URL_GETTER,
  USER_NAME_GETTER,
} from '../store'

export default {
  name: 'Bidders',
  components: {
    BidActions,
  },
  computed: {
    ...mapState([
      'bids',
    ]),
    ...mapGetters([
      USER_IMAGE_URL_GETTER,
      USER_NAME_GETTER,
    ])
  }
}
</script>
