<template>
  <q-page class="row">
    <q-card class="full-width q-pa-sm">
      <q-card-section>
        <q-table
          :data="notifications"
          :columns="columns"
          row-key="index"
          virtual-scroll
          :pagination.sync="pagination"
          :rows-per-page-options="[0]"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Notifications',
  data() {
    return {
      pagination: {
        rowsPerPage: 100,
      },
      columns: [
        {
          name: 'type',
          label: 'Type',
          align: 'center',
          field: 'type',
          sortable: true,
        },
        {
          name: 'created_at',
          label: 'Date',
          align: 'left',
          field: 'created_at',
          sortable: true,
        },
        {
          name: 'message',
          label: 'Message',
          align: 'left',
          field: 'message',
          sortable: true,
        }
      ]
    }
  },
  computed: {
    ...mapState([
      'notifications',
    ])
  }
}
</script>
