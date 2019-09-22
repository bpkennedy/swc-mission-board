<template>
  <q-tabs
    narrow-indicator
    active-color="white"
  >
    <q-route-tab
      icon="public"
      to="/public"
      exact
      replace
      aria-label="Public Navigation"
    >
      Public
    </q-route-tab>
    <q-route-tab
      icon="developer_board"
      to="/boards"
      exact
      replace
      aria-label="Boards Navigation"
    >
      Boards
    </q-route-tab>
    <q-route-tab
      icon="assignment"
      to="/missions"
      exact
      replace
      aria-label="Missions Navigation"
    >
      Missions
    </q-route-tab>
  </q-tabs>
</template>

<script>
export default {
  name: 'TabNav',
}
</script>

<style></style>
