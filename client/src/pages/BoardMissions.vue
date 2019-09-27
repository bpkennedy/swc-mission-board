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
      <missions-list :missions="boardMissions" />
      <q-inner-loading
        :showing="loadingIsVisible"
        transition-show="fade"
        transition-hide="fade"
      >
        <q-spinner-pie
          size="4em"
          color="primary"
        />
      </q-inner-loading>
    </q-page>
  </transition>
</template>

<style>
</style>

<script>
import { mapState } from 'vuex'
import { GET_BOARD_MISSIONS_ACTION } from '../store'
import MissionsList from '../components/MissionsList.vue'

export default {
  name: 'BoardMissions',
  components: {
    MissionsList
  },
  data() {
    return {
      loadingIsVisible: false,
    }
  },
  computed: {
    ...mapState([
      'boardMissions'
    ]),
  },
  beforeCreate() {
    this.loadingIsVisible = true
  },
  async mounted() {
    await this.$store.dispatch(GET_BOARD_MISSIONS_ACTION, {
      boardId: this.$route.params.id,
      router: this.$router
    })
    this.loadingIsVisible = false
  }
}
</script>
