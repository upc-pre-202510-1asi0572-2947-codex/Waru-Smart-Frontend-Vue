<script>

import Card from 'primevue/card';
import Button from "primevue/button";

export default {
  name: "productivity-report",
  components: {
    Button,
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
    },

    //Creates a txt file for the user to download
    download(){
      let contenido = "PRODUCTIVITY REPORT\n\n"

      for(let i = 0; i < this.reports.length; i++){
        contenido += this.reports[i].name.toUpperCase() + "\nId: " + this.reports[i].id + "\n";
        contenido += "Area: " + this.reports[i].area + "\n";
        contenido += "Producion: " + this.reports[i].production + "\n";
        contenido += "Productivity: " + this.reports[i].production/this.reports[i].area + " val/hectareas \n\n";
      }

      const blob = new Blob([contenido], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = "Productivity Report.txt";
      link.click();
      URL.revokeObjectURL(url)
    }
  }
}

</script>

<template>
  <h2>Productivity Report</h2>
  <p></p>
  <Button label="Download Report" class="downloadButton" @click="download()"/>

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

  .downloadButton{
    background-color: #005034
  }

  template{
    text-color: #00ba7b;
  }
</style>