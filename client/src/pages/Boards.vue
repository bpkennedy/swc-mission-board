<template>
  <transition
    appear
    enter-active-class="animated slideInRight"
    leave-active-class="animated slideOutLeft"
    mode="out-in"
  >
    <q-page
      class="flex flex-center column"
      padding
    >
      <board-row
        v-for="board of validBoards"
        :key="board.uid"
        :board="board"
      />
    </q-page>
  </transition>
</template>

<style>
</style>

<script>
import { mapState } from 'vuex'
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
}
</script>
