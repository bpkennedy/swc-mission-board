<template>
  <q-card class="feedback-card">
    <q-item
      class="text-white"
      :class="{
        'bg-positive':rating === 'Positive',
        'bg-blue-grey':rating === 'Neutral',
        'bg-negative':rating === 'Negative'}"
    >
      <q-item-section>
        <q-chip class="feedback-chip">
          <q-avatar>
            <img :src="USER_IMAGE_URL_GETTER(contractor)">
          </q-avatar>
          <div class="ellipsis user-name">
            {{ USER_NAME_GETTER(contractor) }}
          </div>
        </q-chip>
        <q-item-label
          class="text-white text-overline q-pa-xs"
        >
          {{ swcTime(createdAt) }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-card-section>
      <q-item-label>
        <span :class="{
        'text-positive':rating === 'Positive',
        '':rating === 'Neutral',
        'text-negative':rating === 'Negative'}"
        >
          {{ rating }}
        </span>: {{ comment }}
      </q-item-label>
    </q-card-section>
  </q-card>
</template>

<style lang="stylus">
.feedback-card {
  width: 100%;
  max-width: 13rem;
}
.feedback-chip {
  max-width: 10.5rem;
}
.user-name {
  max-width: 7.5rem;
}
</style>

<script>
import { mapGetters, mapState } from 'vuex'
import { swcTime } from '../utils'
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
    },
    createdAt: {
      type: String,
      required: true,
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
  },
  methods: {
    swcTime,
  },
}
</script>
