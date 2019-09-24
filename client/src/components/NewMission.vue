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
        Create New Mission
      </div>
    </q-card-section>

    <q-card-section>
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md"
      >
        <q-input
          outlined
          v-model="title"
          label="Mission Title *"
          hint="A title/summary of the Mission"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />
        <q-input
          outlined
          type="textarea"
          v-model="description"
          label="Mission Description"
          hint="The details of the Mission"
        />
        <q-select
          outlined
          v-model="missionType"
          :options="MISSION_TYPES_FOR_SELECT_GETTER"
          label="Mission Type"
          hint="The type of Mission"
        />
        <q-select
          outlined
          v-model="audience"
          :options="audienceOptions"
          label="Audience"
          hint="Public or Private Mission?"
        />
        <q-input
          outlined
          v-model="startByDate"
          label="Mission Start By Date"
          hint="Ex. Y 20 D 301"
        />
        <q-input
          outlined
          v-model="completeByDate"
          label="Mission Complete By Date"
          hint="Ex. Y 20 D 315"
        />
        <q-item
          tag="label"
          v-ripple
        >
          <q-item-section
            avatar
            top
          >
            <q-toggle v-model="anonymous" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Anonymous?</q-item-label>
            <q-item-label caption>
              Anonymous missions allow creators to offer missions without the bidders knowing who is offering the mission. <bold>Note:</bold> This does not prevent the obvious limitations of owning assets and assigning pilot/commander to mission assignees which would reveal your identity. We encourage you to consider a trusted middle when creating anonymous missions that require anonymity.
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          tag="label"
          v-ripple
        >
          <q-item-section
            avatar
            top
          >
            <q-toggle v-model="autoAccept" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Auto-Accept?</q-item-label>
            <q-item-label caption>
              Enabling auto-accept will allow mission creators to automatically accept the first bid that is offered for the Mission.
            </q-item-label>
          </q-item-section>
        </q-item>

        <div>
          <q-btn
            label="Submit"
            type="submit"
            color="primary"
          />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
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
    </q-card-section>
  </q-card>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { CREATE_MISSION_ACTION, MISSION_TYPES_FOR_SELECT_GETTER } from '../store'

export default {
  name: 'NewMission',
  data() {
    return {
      title: null,
      description: null,
      missionType: null,
      audience: 'Public',
      audienceOptions: ['Public', 'Private'],
      startByDate: null,
      completeByDate: null,
      anonymous: false,
      autoAccept: false,
      loadingIsVisible: false,
    }
  },
  computed: {
    ...mapGetters([MISSION_TYPES_FOR_SELECT_GETTER])
  },
  methods: {
    async onSubmit () {
      this.loadingIsVisible = true
      await this.$store.dispatch(CREATE_MISSION_ACTION, {
        formData: {
          title: this.title.trim(),
          description: this.description ? this.description.trim() : '',
          missionType: this.missionType.value,
          audience: [this.audience],
          startByDate: this.startByDate ? this.startByDate.trim() : '',
          completeByDate: this.completeByDate ? this.completeByDate.trim() : '',
          anonymous: this.anonymous,
          autoAccept: this.autoAccept,
        },
        closePopupElement: this.$refs.closeButton.$el,
      })
      this.loadingIsVisible = false
    },
    onReset () {
      Vue.set(this, 'title', null)
      Vue.set(this, 'description', null)
      Vue.set(this, 'missionType', null)
      Vue.set(this, 'audience', null)
      Vue.set(this, 'startByDate', null)
      Vue.set(this, 'completeByDate', null)
      Vue.set(this, 'anonymous', false)
      Vue.set(this, 'autoAccept', false)
    }
  }
}
</script>

<style>
</style>
