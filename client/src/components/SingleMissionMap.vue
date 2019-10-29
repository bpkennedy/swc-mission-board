<template>
  <l-map
    :zoom="2"
    :crs="crs"
    :max-zoom="4"
    :min-zoom="0"
    :bounds="locationBounds"
  >
    <l-tile-layer
      :url="url"
      :attribution="attribution"
    />
    <l-marker
      v-if="startingX && startingY"
      :lat-lng="xy(startingX, startingY)"
      :icon="iconStart"
    >
      <l-popup>
        <div>Starting: <b>{{ startingSystemName }}</b></div>
        <div>{{ startingX + ',' + startingY }}</div>
      </l-popup>
    </l-marker>
    <l-marker
      v-if="endingX && endingY"
      :lat-lng="xy(endingX,endingY)"
      :icon="iconEnd"
    >
      <l-popup>
        <div>Destination: <b>{{ endingSystemName }}</b></div>
        <div>{{ endingX + ',' + endingY }}</div>
      </l-popup>
    </l-marker>
    <l-polyline
      v-if="startingX && startingY && endingX && endingY"
      :lat-lngs="[xy(startingX, startingY), xy(endingX, endingY)]"
    />
  </l-map>
</template>

<style>
</style>

<script>
import L from 'leaflet'
import { LMap, LTileLayer, LMarker, LPolyline, LPopup } from 'vue2-leaflet'
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
  name: 'SingleMissionMap',
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
    startingSystemName: {
      type: String,
      required: true,
    },
    endingSystemName: {
      type: String,
      required: true,
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
    locationBounds() {
      if (this.startingX && this.startingY && this.endingX && this.endingY) {
        return [xy(this.startingX, this.startingY), xy(this.endingX, this.endingY)]
      } else if (this.startingX && this.startingY) {
        return [xy(this.startingX, this.startingY)]
      }
      return [xy(this.endingX, this.endingY)]
    }
  },
  methods: {
    xy,
  }
}
</script>
