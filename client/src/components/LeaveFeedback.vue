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
        Leave Feedback
      </div>
    </q-card-section>

    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-pa-lg"
    >
      <q-select
        outlined
        v-model="feedbackData.rating"
        :options="ratingTypes"
        label="Rating"
        class="q-pb-md"
      />
      <q-input
        outlined
        v-model="feedbackData.comment"
        type="textarea"
        label="Comment"
        class="q-pb-md"
      />
      <q-btn
        label="Finish"
        type="submit"
        color="primary"
      />
      <q-btn
        flat
        @click="closeDialog"
        color="primary"
        label="Cancel"
        class="q-ml-sm"
      />
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
  </q-card>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import { LEAVE_FEEDBACK_ACTION } from '../store'
import { POSITIVE, NEUTRAL, NEGATIVE } from '../constants'

export default {
  name: 'LeaveFeedback',
  components: {},
  data() {
    return {
      feedbackData: {
        comment: null,
        rating: null,
      },
      ratingTypes: [
        {
          value: POSITIVE,
          label: POSITIVE,
        },
        {
          value: NEUTRAL,
          label: NEUTRAL,
        },
        {
          value: NEGATIVE,
          label: NEGATIVE,
        },
      ],
      loadingIsVisible: false,
    }
  },
  computed: {
    ...mapState(['mission'])
  },
  methods: {
    closeDialog() {
      this.onReset()
      this.$refs.closeButton.$el.click()
    },
    async onSubmit () {
      this.loadingIsVisible = true
      await this.$store.dispatch(LEAVE_FEEDBACK_ACTION, {
        missionId: this.mission.uid,
        formData: {
          comment: this.feedbackData.comment.trim(),
          rating: this.feedbackData.rating.value,
          missionId: this.mission.uid,
        },
        closePopupElement: this.$refs.closeButton.$el,
      })
      this.loadingIsVisible = false
    },
    onReset () {
      Vue.set(this.feedbackData, 'comment', null)
      Vue.set(this.feedbackData, 'rating', null)
    }
  },
}
</script>

<style>
</style>
