<template>
  <q-item>
    <q-item-section
      top
      avatar
    >
      <q-avatar
        v-if="mission.anonymous"
        color="primary"
        text-color="white"
        icon="public"
      >
        <q-tooltip>Public Mission</q-tooltip>
      </q-avatar>
      <q-avatar
        v-else
        rounded
      >
        <img :src="getUserImageFromUid(mission.created_by)">
        <q-tooltip>
          Public Mission by {{ getUserNameFromUid(mission.created_by) }}
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
      <q-icon
        v-if="mission.anonymous"
        name="face"
        color="black"
      >
        <q-tooltip>Anonymous</q-tooltip>
      </q-icon>
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
    getUserImageFromUid(uid) {
      const creator = this.$store.state.users.find(user => user.uid === uid)
      return creator.image
    },
    getUserNameFromUid(uid) {
      const creator = this.$store.state.users.find(user => user.uid === uid)
      return creator.handle
    }
  }
}
</script>
