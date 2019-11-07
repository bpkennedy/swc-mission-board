<template>
  <q-list
    v-if="display === 'column'"
    bordered
    class="no-top-border"
  >
    <q-scroll-area style="height: 100%;">
      <q-item>
        <q-item-section>
          <q-item-label>Description</q-item-label>
          <q-item-label caption>
            {{ mission.description }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>Type</q-item-label>
          <q-item-label caption>
            {{ missionTypeName(mission.mission_type_id) }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>Pay</q-item-label>
          <q-item-label caption>
            <q-icon name="attach_money" />{{ formatPrice(mission.pay) }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>Audience</q-item-label>
          <q-item-label caption>
            <span
              v-for="audience of audiences"
              :key="audience.uid"
            >
              {{ audience.name }}
            </span>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>Start By Date</q-item-label>
          <q-item-label caption>
            {{ mission.start_by_date }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>End By Date</q-item-label>
          <q-item-label caption>
            {{ mission.end_by_date }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-separator spaced />
      <q-item-label header>
        Location
      </q-item-label>
      <q-item v-if="mission.startingX && mission.startingY">
        <q-item-section>
          <q-item-label>
            Starting System
          </q-item-label>
          <q-item-label caption>
            {{ mission.startingSystemName }} ({{ mission.startingX }}, {{ mission.startingY }})
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-if="mission.endingX && mission.endingY">
        <q-item-section>
          <q-item-label>
            Destination System
          </q-item-label>
          <q-item-label caption>
            {{ mission.endingSystemName }} ({{ mission.endingX }}, {{ mission.endingY }})
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-separator spaced />
      <created-by
        :created-by="mission.created_by"
        :origin-board-id="mission.origin_board_id"
      />
      <contractor v-if="MISSION_IS_PAID" />
    </q-scroll-area>
  </q-list>
  <q-card v-else>
    test card area.
  </q-card>
</template>

<style>
</style>

<script>
import { mapState, mapGetters } from 'vuex'
import { formatPrice } from '../utils'
import CreatedBy from './CreatedBy.vue'
import Contractor from './Contractor.vue'
import { MISSION_IS_PAID } from '../store'

export default {
  name: 'MissionSummary',
  components: {
    CreatedBy,
    Contractor,
  },
  props: {
    display: {
      type: String,
      default: 'column'
    }
  },
  data() {
    return {
      audiences: [],
    }
  },
  computed: {
    ...mapState([
      'mission',
    ]),
    ...mapGetters([
      MISSION_IS_PAID,
    ]),
  },
  methods: {
    missionTypeName(typeUid) {
      return this.$store.state.missionTypes.find(type => type.uid === typeUid).name
    },
    getAudienceBoardNames(boardIds) {
      for (let boardId of boardIds) {
        if (boardId === 'Public') {
          this.audiences.push({ name: 'Public', uid: 'public' })
          continue
        }
        this.audiences.push(this.$store.state.boards.find(board => board.uid === boardId))
      }
    },
    formatPrice,
  },
  created() {
    this.getAudienceBoardNames(this.mission.board_ids)
  }
}
</script>
