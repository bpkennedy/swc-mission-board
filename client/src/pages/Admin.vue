<template>
  <q-page class="flex flex-center">
    <q-btn
      @click="doTask('update-systems')"
      color="primary"
      :loading="loading"
      label="Load SWC Systems"
    >
      <q-tooltip>
        Load SWC Systems Data
      </q-tooltip>
    </q-btn>
  </q-page>
</template>

<style>
</style>

<script>
import { START_ADMIN_TASK_ACTION } from '../store'
import { genericError } from '../utils'

export default {
  name: 'Admin',
  components: {
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    async doTask (task) {
      this.loading = true
      try {
        await this.$store.dispatch(START_ADMIN_TASK_ACTION, task)
      } catch (error) {
        genericError(JSON.stringify(error, null, 2))
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
