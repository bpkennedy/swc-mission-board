<template>
  <div class="q-gutter-md">
    <q-item
      tag="label"
      v-ripple
    >
      <q-item-section
        avatar
        top
      >
        <q-toggle v-model="value.anonymous" />
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
        <q-toggle v-model="value.autoAccept" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Auto-Accept?</q-item-label>
        <q-item-label caption>
          Enabling auto-accept will allow mission creators to automatically accept the first bid that is offered for the Mission.
        </q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>

<style>
</style>

<script>
export default {
  name: 'PermissionDetails',
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  watch: {
    value() {
      this.$emit('input', this.value)
    }
  }
}
</script>
