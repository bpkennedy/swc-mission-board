<template>
  <l-map
    :zoom="2"
    :crs="crs"
    :max-zoom="5"
    :min-zoom="0"
  >
    <l-tile-layer
      :url="url"
      :attribution="attribution"
    />
    <l-marker
      v-for="mission of missionsWithStartingLocations"
      :key="mission.uid"
      :lat-lng="xy(mission.startingX, mission.startingY)"
      :icon="iconStart"
    >
      <l-popup>
        <div>Starting: <b>{{ mission.startingSystemName }}</b></div>
        <div>{{ mission.startingX + ',' + mission.startingY }}</div>
      </l-popup>
    </l-marker>
    <l-marker
      v-for="mission of missionsWithEndingLocations"
      :key="mission.uid"
      :lat-lng="xy(mission.endingX, mission.endingY)"
      :icon="iconEnd"
    >
      <l-popup>
        <div>Destination: <b>{{ mission.endingSystemName }}</b></div>
        <div>{{ mission.endingX + ',' + mission.endingY }}</div>
      </l-popup>
    </l-marker>
  </l-map>
</template>

<style>
</style>

<script>
import L from 'leaflet'
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'
import { fqdn } from '../store'
import { xy } from '../utils'

const startIcon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 365 560" enable-background="new 0 0 365 560" xml:space="preserve">
    <g>
      <path fill="#42db49" d="M182.9,551.7c0,0.1,0.2,0.3,0.2,0.3S358.3,283,358.3,194.6c0-130.1-88.8-186.7-175.4-186.9   C96.3,7.9,7.5,64.5,7.5,194.6c0,88.4,175.3,357.4,175.3,357.4S182.9,551.7,182.9,551.7z M122.2,187.2c0-33.6,27.2-60.8,60.8-60.8   c33.6,0,60.8,27.2,60.8,60.8S216.5,248,182.9,248C149.4,248,122.2,220.8,122.2,187.2z"/>
    </g>
  </svg>`

const endIcon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 365 560" enable-background="new 0 0 365 560" xml:space="preserve">
    <g>
      <path fill="#f54242" d="M182.9,551.7c0,0.1,0.2,0.3,0.2,0.3S358.3,283,358.3,194.6c0-130.1-88.8-186.7-175.4-186.9   C96.3,7.9,7.5,64.5,7.5,194.6c0,88.4,175.3,357.4,175.3,357.4S182.9,551.7,182.9,551.7z M122.2,187.2c0-33.6,27.2-60.8,60.8-60.8   c33.6,0,60.8,27.2,60.8,60.8S216.5,248,182.9,248C149.4,248,122.2,220.8,122.2,187.2z"/>
    </g>
  </svg>`

L.CRS.SwcSystem = L.extend({}, L.CRS.Simple, {
  // We are at Zoom level 0
  // Tile size from my tilecutter script in photoshop produces 256x256px, and these should
  // represent the entire "world" of size 1000x1000 (even though the photoshop image I cut from was 4096x4096, the scale of the original swc map is 1000x1000), therefore:
  // Scale is 1000 / 256 = 3.90625 (use the reverse in transformation 1/3.90625)
  // We want the center of tile 0/0/0 to be coordinates [0, 0], therefore:
  // Offset is 1000 * 1/3.90625 / 2 = 128
  transformation: new L.Transformation(1 / 3.90625, 128, -1 / 3.90625, 128)
})

export default {
  name: 'MissionsMap',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
  },
  props: {
    missions: {
      type: () => [],
      default: []
    }
  },
  data() {
    return {
      center: [0, 0],
      url: fqdn + '/map/{z}/{x}/{y}.png',
      attribution: '',
      crs: L.CRS.SwcSystem,
      iconStart: L.icon({
        iconUrl: 'data:image/svg+xml;base64,' + btoa(startIcon),
        iconSize: [32, 37],
        iconAnchor: [16, 37]
      }),
      iconEnd: L.icon({
        iconUrl: 'data:image/svg+xml;base64,' + btoa(endIcon),
        iconSize: [32, 37],
        iconAnchor: [16, 37]
      }),
    }
  },
  computed: {
    missionsWithStartingLocations() {
      return this.missions.filter(m => m.startingX && m.startingY)
    },
    missionsWithEndingLocations() {
      return this.missions.filter(m => m.endingX && m.endingY)
    },
  },
  methods: {
    xy,
  }
}
</script>
