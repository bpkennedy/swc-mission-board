<template>
  <q-card class="board-card">
    <img :src="board.image">
    <q-card-section>
      <div class="text-h6">
        {{ board.name }}
      </div>
    </q-card-section>
  </q-card>
</template>

<style lang="stylus">
.board-card
  width: 100%
  max-width: 300px
</style>

<script>
export default {
  name: 'BoardRow',
  props: {
    board: {
      type: Object,
      required: true
    }
  },
  methods: {
  }
}
</script>
