<template>
  <q-page class="flex flex-center">
    <l-map
      style="height: 100%; width: 100%; position: absolute;"
      :zoom="2"
      :max-zoom="4"
      :min-zoom="0"
      :center="center"
    >
      <l-tile-layer
        :url="url"
        :attribution="attribution"
      />
    </l-map>
  </q-page>
</template>

<style>
</style>

<script>
import { LMap, LTileLayer } from 'vue2-leaflet'
import { fqdn } from '../store'
const L = window.L

export default {
  name: 'Map',
  components: {
    LMap,
    LTileLayer,
  },
  data() {
    return {
      center: L.latLng(0, 0),
      url: fqdn + '/map/{z}/{x}/{y}.png',
      attribution: '',
    }
  }
}
</script>
