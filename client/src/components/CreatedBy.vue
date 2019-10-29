<template>
  <div>
    <q-item-label
      header
    >
      Created By
    </q-item-label>
    <q-item>
      <q-item-section avatar>
        <q-avatar>
          <img :src="createdByImageUrl">
        </q-avatar>
      </q-item-section>
      <q-item-section>{{ createdByName }}</q-item-section>
    </q-item>
  </div>
</template>

<style>
</style>

<script>
import { mapState, mapGetters } from 'vuex'
import {
  BOARD_IMAGE_URL_GETTER,
  BOARD_NAME_GETTER,
  USER_IMAGE_URL_GETTER,
  USER_NAME_GETTER
} from '../store'

export default {
  name: 'CreatedBy',
  props: {
    createdBy: {
      type: String,
      required: true
    },
    originBoardId: {
      type: String,
      default: null,
    }
  },
  computed: {
    ...mapState([
      'boards',
      'users',
    ]),
    ...mapGetters([
      BOARD_IMAGE_URL_GETTER,
      BOARD_NAME_GETTER,
      USER_IMAGE_URL_GETTER,
      USER_NAME_GETTER,
    ]),
    createdByImageUrl() {
      if (this.originBoardId) {
        return this.BOARD_NAME_GETTER(this.originBoardId)
      }
      return this.USER_IMAGE_URL_GETTER(this.createdBy)
    },
    createdByName() {
      if (this.originBoardId) {
        return this.BOARD_NAME_GETTER(this.originBoardId)
      }
      return this.USER_NAME_GETTER(this.createdBy)
    },
  }
}
</script>
