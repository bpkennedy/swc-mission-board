<template>
  <q-page-container>
    <q-header
      bordered
      class="bg-white text-black"
    >
      <q-toolbar>
        <q-btn
          @click="$router.go(-1)"
          flat
          dense
          class="q-mr-sm"
        >
          <q-icon name="arrow_back_ios" />
          Back
        </q-btn>

        <q-item-section class="text-center">
          <q-item-label
            lines="1"
          >
            {{ mission.title }}
          </q-item-label>
        </q-item-section>
      </q-toolbar>
    </q-header>
    <router-view />
  </q-page-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'NavigationLayout',
  computed: {
    ...mapState([
      'mission'
    ])
  }
}
</script>

<style>
</style>
