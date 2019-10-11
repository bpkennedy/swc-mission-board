<template>
  <q-list v-if="display === 'column'">
    <q-scroll-area style="height: 100%;">
      <q-item>
        <q-item-section>
          <q-item-label>Title</q-item-label>
          <q-item-label caption>
            {{ mission.title }}
          </q-item-label>
        </q-item-section>
      </q-item>
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
            {{ mission.pay }}
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
    </q-scroll-area>
  </q-list>
  <q-card v-else>
    test card area.
  </q-card>
</template>

<style>
</style>

<script>
export default {
  name: 'MissionSummary',
  props: {
    mission: {
      type: Object,
      required: true
    },
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
    }
  },
  created() {
    this.getAudienceBoardNames(this.mission.board_ids)
  }
}
</script>
