<script>

import Card from 'primevue/card';

export default {
  name: "productivity-report",
  components: {
    Card
  },
  data(){
    return {
      reports: [ {
        id: 1,
        name: "Arroz",
        production: 2,
        area: 10
      }, {
        id: 2,
        name: "Mango",
        production: 3,
        area: 80
      }, {
        id: 3,
        name: "Trigo",
        production: 5,
        area: 80
      }, {
        id: 4,
        name: "Azucar",
        production: 9,
        area: 40
      }]
    };
  },
  methods: {
    async getData(){
      //TODO: Obtener la data del endpoint
    }
  }
}

</script>

<template>
  <h2>Productivity Report</h2>
  <p>Produccion de cada cultivo segun produccion/area, calculada con cada cosecha</p>

  <div>
    <card v-for="(report, index) in reports" key="{{name}}" style="border-radius:2em">
      <template #title> {{ report.name }} </template>
      <template #subtitle> Valor de productividad: {{report.production/report.area}} val/hectarea </template>
      <template #content>
        <div>
          <p>Numero de identificacion: {{report.id}}</p>
          <p>Produccion: {{report.production}}</p>
          <p>Hectareas: {{report.area}}</p>
        </div>
      </template>
    </card>
  </div>
</template>

<style scoped>
  .p-card{
    background: #00ba7b;
    border-radius: 20px;
    margin-top: 20px;
  }

  template{
    text-color: #00ba7b;
  }
</style>