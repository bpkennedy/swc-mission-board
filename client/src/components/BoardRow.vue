<template>
  <q-card
    class="board-card"
    clickable
    v-ripple
  >
    <img
      :src="board.image"
      class="q-pa-md border-bottom"
    >
    <q-card-section>
      <div class="text-h6 text-center">
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

<style lang="stylus">
.board-card {
  &:hover {
    cursor: pointer;
  }
  .border-bottom {
    border-bottom: 1px solid #eeeeee;
  }
}
</style>
