<script>

import Card from 'primevue/card';
import Button from "primevue/button";

export default {
  name: "water-consumption-report",
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
    },

    //Creates a txt file for the user to download
    download(){
      let content = "WATER REPORT\n\n"

      for(let i = 0; i < this.reports.length; i++){
        let report = this.reports[i];
        content += report.name.toUpperCase() + "\nId: " + report.id + "\n";
        content += "Irrigations: \n";
        content += "--------------------------------\n";

        for(let j = 0; j < report.irrigation.length; j++){
          content += "Date: " + report.irrigation[j].date + "\n";
          content += "Water consumption: " + report.irrigation[j].quantity + "\n";
          content += "--------------------------------\n";
        }
        content += "\n";
      }

      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = "Water Report.txt";
      link.click();
      URL.revokeObjectURL(url)
    }
  }
}

</script>

<template>
  <h2>Water Consumption Report</h2>
  <p></p>
  <Button label="Download Report" class="downloadButton" @click="download()"/>

  <div v-for="report in reports">
    <Card style="margin-bottom: 1em; background:#00ba7b; border-radius:2em" class="m-6">
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
.downloadButton{
  background-color: #005034
}
</style>