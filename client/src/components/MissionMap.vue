<template>
  <l-map
    style="height: 100%; width: 100%; position: absolute;"
    :zoom="2"
    :crs="crs"
    :max-zoom="4"
    :min-zoom="0"
  >
    <l-tile-layer
      :url="url"
      :attribution="attribution"
    />
    <l-marker
      :lat-lng="xy(startingX, startingY)"
      :icon="icon"
    />
    <l-marker
      :lat-lng="xy(endingX,endingY)"
      :icon="icon"
    >
      <l-popup :content="'Test Name'" />
    </l-marker>
    <l-polyline :lat-lngs="[xy(startingX, startingY), xy(endingX, endingY)]" />
  </l-map>
</template>

<style>
</style>

<script>
import L from 'leaflet'
import { LMap, LTileLayer, LMarker, LPolyline, LPopup } from 'vue2-leaflet'
import { fqdn } from '../store'
import { xy } from '../utils'

export default {
  name: 'MissionMap',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPolyline,
    LPopup,
  },
  props: {
    startingX: {
      type: Number,
      required: true
    },
    startingY: {
      type: Number,
      required: true
    },
    endingX: {
      type: Number,
      required: true
    },
    endingY: {
      type: Number,
      required: true
    },
  },
  data() {
    return {
      center: [0, 0],
      url: fqdn + '/map/{z}/{x}/{y}.png',
      attribution: '',
      crs: L.CRS.Simple,
      icon: L.icon({
        iconUrl: fqdn + '/map/mapMarker.png',
        iconSize: [32, 37],
        iconAnchor: [16, 37]
      }),
    }
  },
  methods: {
    xy,
  }
}
</script>
