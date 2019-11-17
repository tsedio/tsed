<template>
  <div class="calendars-page">
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Calendar of</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="calendar of calendars" :key="calendar.id">
        <td>{{calendar.id}}</td>
        <td>{{calendar.name}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  // @ is an alias to /src
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'calendars-view',
    components: {},
    computed: {
      ...mapGetters(['calendars'])
    },
    mounted () {
      this.getCalendars()
    },
    methods: {
      ...mapActions(['getCalendars'])
    }
  }
</script>
<style src="./Calendars.view.scss" lang="scss"></style>
