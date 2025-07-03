<template>

  <div class="container">
    <!-- Imagen -->
    <div class="image-container">
      <img :src="sowing?.crop_info?.imageUrl" alt="Crop Image" />
    </div>

    <!-- Información del Sowing -->
    <div class="labels-container">
      <div class="row" v-for="(row, index) in rows" :key="index">
        <div
            class="column"
            v-for="(label, columnIndex) in row"
            :key="columnIndex"
            :class="{ 'grey-label': columnIndex % 2 === 0, 'green-label': columnIndex % 2 !== 0 }"
        >
          {{ label }}
        </div>
        <div class="separator" v-if="index < rows.length - 1"></div>
      </div>
    </div>

    <!-- Información de los dispositivos IoT -->
    <div v-if="iotDevicesInfo" class="iot-info">
      <h3>IoT Devices Information</h3>
      <ul>
        <li>Total Devices: {{ iotDevicesInfo.quantityDevices }}</li>
        <li>Active Devices: {{ iotDevicesInfo.quantityActiveDevices }}</li>
        <li>Inactive Devices: {{ iotDevicesInfo.quantityInactiveDevices }}</li>
        <li>Disconnected Devices: {{ iotDevicesInfo.quantityDisconnectedDevices }}</li>
        <li>Humidity Devices: {{ iotDevicesInfo.quantityHumidityDevices }}</li>
        <li>Temperature Devices: {{ iotDevicesInfo.quantityTemperatureDevices }}</li>
        <li>Soil Moisture Devices: {{ iotDevicesInfo.quantitySoilMoistureDevices }}</li>
      </ul>
    </div>
    <div>
      <Button label="Text" class="onOffButton" @click="fas()"/>
    </div>
  </div>
</template>

<script>
import { SowingsApiService } from "../services/sowings-api.service.js";
import { CropsRecomendationApiService } from "../services/crops-recomendation-api.service.js";
import { SowingsDevicesApiService } from "../services/sowing-devices-api.service.js";
import Button from 'primevue/button';

export default {
  name: "GeneralInformation",
  components: {Button},
  props: ["sowingId"],
  data() {
    return {
      sowing: null,
      rows: [],
      iotDevicesInfo: null, // Nueva propiedad para almacenar la información de dispositivos IoT
    };
  },
  watch: {
    sowingId: {
      immediate: true,
      handler(newVal, oldVal) {
        console.log("sowingId changed from", oldVal, "to", newVal);
        this.loadSowing();
      },
    },
  },
  methods: {
    async loadSowing() {
      if (!this.sowingId) {
        return;
      }
      const sowingService = new SowingsApiService();
      const cropApiService = new CropsRecomendationApiService();
      const devicesApiService = new SowingsDevicesApiService();

      try {
        const sowingResponse = await sowingService.getById(this.sowingId);
        this.sowing = sowingResponse.data;
        console.log("Received sowing:", this.sowing);

        if (!this.sowing.cropId) {
          throw new Error("Crop ID is undefined");
        }

        const cropResponse = await cropApiService.getCropById(this.sowing.cropId);
        this.sowing.crop_info = cropResponse.data;
        console.log("Received crop:", this.sowing.crop_info);

        const dateParts = this.sowing.startDate.split("T");
        const dateOnly = dateParts[0];
        this.rows = [
          ["Crop Name", this.sowing.crop_info.name],
          ["Sowing Date", dateOnly],
          ["Estimated Harvest", this.sowing.endDate.split("T")[0]],
          ["Planted Area (m²)", this.sowing.areaLand],
          ["Phenological Phase", this.sowing.phenologicalPhaseName],
        ];

        // Llama al método para obtener la información de dispositivos IoT
        const devicesResponse = await devicesApiService.getGeneralInformation(this.sowingId);
        this.iotDevicesInfo = devicesResponse.data;
        console.log("Received IoT devices info:", this.iotDevicesInfo);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async fas(){
      console.log("pressed")
    }
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
}

.image-container,
.labels-container,
.iot-info {
  flex: 1;
  max-width: 33%;
  padding: 0 10px;
}

/* Imagen */
.image-container img {
  width: 100%;
  height: auto;
  max-height: 350px;
  object-fit: cover;
  border-radius: 10px;
  display: block;
  margin: 0 auto;
}

/* Info Sowing */
.labels-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.row {
  display: flex;
  margin-bottom: 10px;
}

.column {
  flex: 1;
  padding: 12px;
  text-align: center;
  border-radius: 8px;
  font-size: 1rem;
}

.grey-label {
  background-color: #D9D9D9;
  color: black;
}

.green-label {
  background-color: #3E7C59;
  color: white;
}

/* IoT info */
.iot-info {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  font-size: 1rem;
}

.iot-info h3 {
  margin-bottom: 15px;
  text-align: center;
  color: #3E7C59;
}

.iot-info ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.iot-info li {
  margin-bottom: 8px;
  font-weight: 500;
  text-align: left;
}

.onOffButton{
  background-color: #FF0000
}

/* Responsive */
@media (max-width: 1024px) {
  .container {
    flex-direction: column;
  }
  .image-container,
  .labels-container,
  .iot-info {
    max-width: 100%;
    width: 100%;
  }
}

</style>