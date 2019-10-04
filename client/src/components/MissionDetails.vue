<template>
  <div class="q-gutter-md">
    <q-input
      outlined
      v-model="value.title"
      label="Mission Title *"
      hint="A title/summary of the Mission"
      lazy-rules
      :rules="[ val => val && val.length > 0 || 'Please type something']"
    />
    <q-input
      outlined
      type="textarea"
      v-model="value.description"
      label="Mission Description"
      hint="The details of the Mission"
    />
    <q-select
      outlined
      v-model="value.missionType"
      :options="MISSION_TYPES_FOR_SELECT_GETTER"
      label="Mission Type"
      hint="The type of Mission"
    />
    <q-input
      outlined
      v-model.number="value.pay"
      type="number"
      label="Credits Offered"
      hint="Ex. 3000"
    />
    <q-select
      outlined
      v-model="value.audience"
      :options="audienceOptions"
      label="Audience"
      hint="Public or Private Mission?"
    />
    <q-select
      v-if="value.audience === 'Private'"
      outlined
      v-model="value.board"
      :options="BOARDS_FOR_SELECT_GETTER"
      label="Board"
      hint="Which board is this mission for?"
    />
    <q-input
      outlined
      v-model="value.startByDate"
      label="Mission Start By Date"
      hint="Ex. Y 20 D 301"
    />
    <q-input
      outlined
      v-model="value.completeByDate"
      label="Mission Complete By Date"
      hint="Ex. Y 20 D 315"
    />
  </div>
</template>

<style>
</style>

<script>
import { mapGetters } from 'vuex'
import {
  MISSION_TYPES_FOR_SELECT_GETTER,
  BOARDS_FOR_SELECT_GETTER,
} from '../store'

export default {
  name: 'MissionDetails',
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      audienceOptions: ['Public', 'Private'],
    }
  },
  computed: {
    ...mapGetters([
      MISSION_TYPES_FOR_SELECT_GETTER,
      BOARDS_FOR_SELECT_GETTER,
    ])
  },
  watch: {
    value() {
      this.$emit('input', this.value)
    }
  }
}
</script>
