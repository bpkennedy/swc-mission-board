<template>
  <q-page
    class="q-pa-md row items-start q-gutter-md"
    padding
  >
    <board-row
      v-for="board of validBoards"
      :key="board.uid"
      :board="board"
      @click.native="tryGoToBoard(board.uid, board.name)"
    />
  </q-page>
</template>

<style>
</style>

<script>
import { mapState } from 'vuex'
import { GO_TO_PRIVATE_BOARD } from '../store'
import BoardRow from '../components/BoardRow.vue'

export default {
  name: 'Boards',
  components: {
    BoardRow
  },
  computed: {
    ...mapState([
      'boards'
    ]),
    validBoards() {
      return this.boards.filter(board => board.name.toLowerCase() !== 'public')
    }
  },
  methods: {
    tryGoToBoard(boardId, boardName) {
      this.$store.dispatch(GO_TO_PRIVATE_BOARD, { boardId, boardName, router: this.$router })
    }
  }
}
</script>
