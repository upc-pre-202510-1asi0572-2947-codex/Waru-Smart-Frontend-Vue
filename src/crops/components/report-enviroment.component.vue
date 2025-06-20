<script>

import Card from 'primevue/card';

export default {
  name: "enviroment-report",
  components: {
    Card
  },
  data(){
    return {
      reports: [
        {
          id: 1,
          name: "arroz",
          humidity: [
            {
              date: "10-10-26:20:21:15",
              value: 15
            },
            {
              date: "10-10-26:20:25:15",
              value: 60
            },
            {
              date: "10-10-26:20:29:15",
              value: 2
            },
          ],
          temperature: [
            {
              date: "10-10-26:20:21:15",
              value: 150
            },
            {
              date: "10-10-26:20:25:15",
              value: 40
            },
            {
              date: "10-10-26:20:29:15",
              value: 41
            },
          ]
        },
        {
          id: 2,
          name: "mango",
          humidity: [
            {
              date: "10-10-26:20:21:15",
              value: 14
            },
            {
              date: "10-10-26:20:25:15",
              value: 65
            },
            {
              date: "10-10-26:20:29:15",
              value: 20
            },
          ],
          temperature: [
            {
              date: "10-10-26:20:21:15",
              value: 15
            },
            {
              date: "10-10-26:20:25:15",
              value: 40
            },
            {
              date: "10-10-26:20:29:15",
              value: 42
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
    <h2 style="margin-bottom: 1em; text-align: center">{{report.name}}: {{report.id}}</h2>
    <div class = "grid-container">
      <Card style="margin-bottom: 1em" class="m-6">
        <template #title>Humedad</template>
        <template #content>
          <div v-for="data in report.humidity" style="border: 1px solid black; margin-bottom: 5px">
            <p>Valor {{data.value}}</p>
            <p>Fecha {{data.date}}</p>
          </div>
        </template>
      </Card>
      <Card style="margin-bottom: 1em" class="m-6">
        <template #title>Temperatura</template>
        <template #content>
          <div v-for="data in report.temperature" style="border: 1px solid black; margin-bottom: 5px">
            <p>Valor {{data.value}}</p>
            <p>Fecha {{data.date}}</p>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.grid-container{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1em;
}
</style>