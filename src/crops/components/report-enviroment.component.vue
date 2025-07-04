<script>

import Card from 'primevue/card';
import Button from "primevue/button";

export default {
  name: "enviroment-report",
  components: {
    Button,
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
    },
    download(){
      let content = "ENVIRONMENT REPORT\n\n"

      for(let i = 0; i < this.reports.length; i++){
        let report = this.reports[i];
        content += report.name.toUpperCase() + "\nId: " + report.id + "\n";
        content += "Humidity report: \n";
        content += "--------------------------------\n";

        for(let j = 0; j < report.humidity.length; j++){
          content += "Date: " + report.humidity[j].date + "\n";
          content += "Humidity: " + report.humidity[j].value + "\n";
          content += "--------------------------------\n";
        }

        content += "\nTemperature report: \n";
        content += "--------------------------------\n";

        for(let j = 0; j < report.temperature.length; j++){
          content += "Date: " + report.temperature[j].date + "\n";
          content += "Temperature: " + report.temperature[j].value + "\n";
          content += "--------------------------------\n";
        }
        content += "\n";
      }

      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = "Environment Report.txt";
      link.click();
      URL.revokeObjectURL(url)
    }
  }
}

</script>

<template>
  <h2>Enviroment Report</h2>
  <p></p>
  <Button label="Download Report" class="downloadButton" @click="download()"/>

  <div v-for="report in reports">
    <h2 style="margin-bottom: 1em; text-align: center">{{report.name}}: {{report.id}}</h2>
    <div class = "grid-container">
      <Card style="margin-bottom: 1em; background:#00ba7b; border-radius:2em" class="m-6">
        <template #title>Humedad</template>
        <template #content>
          <div v-for="data in report.humidity" style="border: 1px solid black; margin-bottom: 5px">
            <p>Valor {{data.value}}</p>
            <p>Fecha {{data.date}}</p>
          </div>
        </template>
      </Card>
      <Card style="margin-bottom: 1em; background:#00ba7b; border-radius:2em" class="m-6">
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

.downloadButton{
  background-color: #005034
}
</style>