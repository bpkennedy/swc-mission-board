<template>
  <q-card class="board-card">
    <q-img :src="board.image">
      <div class="text-h5 absolute-bottom text-left">
        {{ board.name }}
      </div>
    </q-img>
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
