<template>
  <q-card class="feedback-card">
    <q-item
      class="text-white"
      :class="{
        'bg-positive':rating === 'Positive',
        'bg-blue-grey':rating === 'Neutral',
        'bg-negative':rating === 'Negative'}"
    >
      <q-item-section avatar>
        <q-avatar>
          <img :src="USER_IMAGE_URL_GETTER(contractor)">
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ USER_NAME_GETTER(contractor) }}</q-item-label>
        <q-item-label
          caption
          class="text-white"
        >
          {{ rating }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-card-section>
      {{ comment }}
    </q-card-section>
  </q-card>
</template>

<style lang="stylus">
.feedback-card {
  width: 100%;
}
</style>

<script>
import { mapGetters, mapState } from 'vuex'
import { USER_NAME_GETTER, USER_IMAGE_URL_GETTER } from '../store'

export default {
  name: 'MissionFeedback',
  props: {
    contractor: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      default: '',
    },
    rating: {
      type: String,
      default: '',
    }
  },
  computed: {
    ...mapState([
      'mission',
    ]),
    ...mapGetters([
      USER_NAME_GETTER,
      USER_IMAGE_URL_GETTER,
    ]),
  }
}
</script>
