<script>

import Card from 'primevue/card';

export default {
  name: "water-consumption-report",
  components: {
    Card
  },
  data(){
    return {
      reports: [
        {
          id: 1,
          name: "arroz",
          irrigation: [
            {
              quantity: 10,
              date: "10-10-26:20:21:15"
            },
            {
              quantity: 20,
              date: "10-10-26:20:22:15"
            },
            {
              quantity: 50,
              date: "10-10-26:20:25:15"
            },
          ]
        },
        {
          id: 2,
          name: "mango",
          irrigation: [
            {
              quantity: 1,
              date: "15-10-26:20:21:15"
            },
            {
              quantity: 40,
              date: "16-10-26:20:22:15"
            },
            {
              quantity: 100,
              date: "17-10-26:20:25:15"
            },
          ]
        },
        {
          id: 3,
          name: "anis",
          irrigation: [
            {
              quantity: 6,
              date: "10-10-27:20:21:15"
            },
            {
              quantity: 107,
              date: "10-10-28:20:22:15"
            },
            {
              quantity: 7,
              date: "10-10-29:20:25:15"
            },
          ]
        },
      ]
    }
  },
  methods: {
    async getData(){
      //TODO Sacar data del back
    }
  }
}

</script>

<template>
  <div v-for="report in reports">
    <Card style="margin-bottom: 1em" class="m-6">
      <template #title>{{report.name}}: {{report.id}}</template>
      <template #content>
        <div v-for="data in report.irrigation" style="border: 1px solid black; margin-bottom: 5px">
          <p>Litros {{data.quantity}}</p>
          <p>Fecha {{data.date}}</p>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>

</style>