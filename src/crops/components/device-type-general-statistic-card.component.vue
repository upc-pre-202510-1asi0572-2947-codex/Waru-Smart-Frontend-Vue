<script>
import VueApexCharts from "vue3-apexcharts";
import {StatisticsApiService} from "../services/statistics-api.service.js";

export default {
  name: "device-type-general-statistic-card",
  components: {
    apexchart: VueApexCharts
  },
  methods: {
    openLink() {
      if (typeof window !== 'undefined') {
        window.open('https://www.digi.com/blog/post/iot-in-agriculture', '_blank');
      } else {
        console.error('window no está disponible');
      }
    }
  },
  data() {
    return {
      showDialog: false,
      mostRegisteredCrop: '',
      chartOptions: {
        chart: {
          type: 'polarArea'
        },
        labels: ['Humidity', 'Temperature', 'Soil Moisture'],
        colors: ['#F15B46', '#FEB019', '#FEB019', '#8D5B4C', '#F47560'],
        plotOptions: {
          polarArea: {
            rings: {
              strokeWidth: 0
            },
            spokes: {
              strokeWidth: 0
            },
          }
        },
        dataLabels: {
          enabled: true
        },
        tooltip: {
          style: {
            colors: ['#ff0000']
          }
        },
        yaxis: {
          show: false
        },
      },
      series: [{
        name: 'Device Type',
        data: []
      }],
    };
  },
  created() {
    const statisticsAPI = new StatisticsApiService();
    statisticsAPI.getAllDevices().then(response => {
      const devices = response.data;

      // Agrupar por sensorType y contar la cantidad de cada tipo
      const sensorTypeCounts = devices.reduce((acc, device) => {
        acc[device.sensorType] = (acc[device.sensorType] || 0) + 1;
        return acc;
      }, {});

      // Configurar los datos para el gráfico polarArea
      this.series = Object.values(sensorTypeCounts); // Solo los valores
      this.chartOptions.xaxis.categories = Object.keys(sensorTypeCounts); // Las categorías
      //Imprimir en consola
      console.log(this.series);
    });
  }
}
</script>

<template>
  <div class="card-container">
    <pv-card class="bg padded-card">
      <template #header>
        <h2>{{ $t('DeviceTypeUsed') }}</h2>
      </template>
      <template #content>
        <apexchart :options="chartOptions" :series="series"  type="polarArea"></apexchart>
      </template>
      <template #footer>
        <button @click="openLink">{{ $t('wannaKnowMore') }}</button>
      </template>
    </pv-card>

  </div>
</template>

<style scoped>
.card-container {
  display: flex;
  justify-content: space-between;
}

@media (max-width: 768px) {
  .card-container {
    justify-content: center;
    margin-left: 0px;
  }
  .padded-card {
    margin-left: 0px !important;
    /*width: 100%;*/
  }
}


h2 {
  color: #ffff;
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
  padding: 0;
}

.bg {
  background-color: var(--primary-main-green);
}

.padded-card {
  margin-top: 40px;
  margin-left: 40px;
  padding: 20px;
  border-radius: 15px;
}

button {
  display: block;
  background-color: white;
  color: black;
  margin: auto;
  margin-top: 25px;
  border: 2px solid black;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog {
  background: white;
  color: black;
  padding: 20px;
  border-radius: 5px;
}
</style>