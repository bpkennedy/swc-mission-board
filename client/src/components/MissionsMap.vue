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
      <l-popup @click.native="goToMission(mission.uid)">
        <div>{{ mission.title }}</div>
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
      <l-popup @click.native="goToMission(mission.uid)">
        <div>{{ mission.title }}</div>
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
import { xy, startIcon, endIcon } from '../utils'

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
    goToMission(id) {
      this.$router.push({
        name: 'mission',
        params: {
          id,
        },
      })
    },
    xy,
  }
}
</script>

<style lang="stylus">
.leaflet-popup-content-wrapper {
  &:hover {
    cursor: pointer;
  }
}
</style>
