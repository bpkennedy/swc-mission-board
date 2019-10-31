<template>
  <q-dialog
    v-model="dialogeVisible"
    persistent
  >
    <q-card>
      <q-card-section class="row items-center">
        <span class="q-ml-sm">
          {{ message }}
        </span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          :label="cancelLabel"
          color="primary"
          v-close-popup
          @click="cancel"
        />
        <q-btn
          flat
          :label="confirmLabel"
          color="primary"
          v-close-popup
          @click="$emit('confirm')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style>
</style>

<script>
import Vue from 'vue'

export default {
  name: 'Confirm',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    confirmLabel: {
      type: String,
      default: 'Yes',
    },
    cancelLabel: {
      type: String,
      default: 'Cancel',
    },
    message: {
      type: String,
      default: 'Are you sure?',
    },
  },
  data() {
    return {
      dialogeVisible: false,
    }
  },
  methods: {
    cancel() {
      this.dialogeVisible = false
      this.$emit('cancel')
    },
  },
  watch: {
    show(newVal) {
      Vue.set(this, 'dialogeVisible', newVal)
    }
  }
}
</script>
