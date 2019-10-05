<template>
  <q-page-container>
    <q-header
      bordered
      class="bg-white text-black"
    >
      <q-toolbar>
        <q-btn
          v-go-back="'/public'"
          flat
          dense
          class="q-mr-sm"
        >
          <q-icon name="arrow_back_ios" />
          Back
        </q-btn>

        <q-item-section>
          <q-item-label
            lines="1"
          >
            TestName
          </q-item-label>
        </q-item-section>
      </q-toolbar>
    </q-header>
    <router-view />
    <app-footer />
  </q-page-container>
</template>

<script>
import AppFooter from '../components/AppFooter.vue'

export default {
  name: 'NavigationLayout',
  components: {
    AppFooter,
  }
}
</script>

<style>
</style>
