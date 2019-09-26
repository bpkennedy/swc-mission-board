<template>
  <q-item>
    <q-item-section
      top
      avatar
    >
      <q-avatar
        v-if="mission.created_by === null"
        color="primary"
        text-color="white"
        icon="face"
      >
        <q-tooltip>Anonymous Public Mission</q-tooltip>
      </q-avatar>
      <q-avatar
        v-else
        rounded
      >
        <img :src="getMissionImageFromUid(mission)">
        <q-tooltip>
          Public Mission by {{ getMissionNameFromUid(mission) }}
        </q-tooltip>
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ mission.title }}</q-item-label>
      <q-item-label
        caption
        lines="2"
      >
        {{ mission.description }}
      </q-item-label>
    </q-item-section>

    <q-item-section
      side
      top
    >
      <q-badge :label="this.missionType(mission.mission_type_id)" />
    </q-item-section>
  </q-item>
</template>

<style>
</style>

<script>
export default {
  name: 'MissionsRow',
  props: {
    mission: {
      type: Object,
      required: true
    }
  },
  methods: {
    missionType(typeId) {
      return this.$store.state.missionTypes.find(type => type.uid === typeId).name
    },
    getMissionImageFromUid(mission) {
      if (mission.origin_board_id) {
        const boardCreator = this.$store.state.boards.find(board => board.uid === mission.origin_board_id)
        return boardCreator.image
      }
      const userCreator = this.$store.state.users.find(user => user.uid === mission.created_by)
      return userCreator.image
    },
    getMissionNameFromUid(mission) {
      if (mission.origin_board_id) {
        const boardCreator = this.$store.state.boards.find(board => board.uid === mission.origin_board_id)
        return boardCreator.name
      }
      const creator = this.$store.state.users.find(user => user.uid === mission.created_by)
      return creator.handle
    }
  }
}
</script>
