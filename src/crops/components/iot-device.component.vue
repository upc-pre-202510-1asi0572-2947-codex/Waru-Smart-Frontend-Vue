<script>
import { SowingsDevicesApiService } from "../services/sowing-devices-api.service.js";
import AddDevicesDialog from "./add-device-dialog.component.vue";
import UpdateDevicesDialog from "./update-device-dialog.component.vue";

export default {
  name: "IoT",
  props: ["sowingId"],
  components: {
    AddDevicesDialog,
    UpdateDevicesDialog,
  },
  data() {
    return {
      devices: [],
      loading: true,
      error: null,
      selectedDevice: null, // Dispositivo seleccionado para actualizar
      showUpdateDialog: false, // Controla la visibilidad del diálogo de actualización
    };
  },
  methods: {
    getStatusClass(status) {
      switch (status) {
        case "Active":
          return "status-active";
        case "Inactive":
          return "status-inactive";
        case "Disconnected":
          return "status-disconnected";
        default:
          return "";
      }
    },
    async loadDevices() {
      this.loading = true;
      const sowingsDevicesService = new SowingsDevicesApiService();
      try {
        const response = await sowingsDevicesService.getDevicesBySowingId(this.sowingId);
        this.devices = response.data;
      } catch (error) {
        console.error("Error al cargar dispositivos IoT:", error);
        this.devices = [];
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return null;
      const date = new Date(dateString);
      return date.toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    openAddDeviceDialog() {
      this.$refs.addDialog.showDialog = true;
    },
    updateDeviceInList(updatedDevice) {
      const index = this.devices.findIndex(device => device.id === updatedDevice.id);
      if (index !== -1) {
        this.devices.splice(index, 1, updatedDevice); // Reemplaza el dispositivo actualizado
      }
    },
    openUpdateDialog(device) {
      this.selectedDevice = device;
      this.showUpdateDialog = true;
    },
    closeUpdateDialog() {
      this.showUpdateDialog = false; // Oculta el diálogo de actualización
      this.selectedDevice = null; // Limpia el dispositivo seleccionado
    },
    getSensorImage(deviceType) {
      switch (deviceType) {
        case "Sensor":
          return "https://res.cloudinary.com/drkelnilg/image/upload/v1747290051/sensor_de_humedad_hpz4u3.webp";
        case "Actuator":
          return "https://res.cloudinary.com/drkelnilg/image/upload/v1747290027/sensor-de-temperatura_nykwvs.jpg";
        default:
          return "/images/default-device.png"; // Imagen predeterminada si no coincide
      }
    },
  },
  watch: {
    sowingId: {
      immediate: true,
      handler() {
        this.loadDevices();
      },
    },
  },
};
</script>

<template>
  <div class="iot-container">
    <h3 class="iot-title">Devices in this sowing</h3>

    <div v-if="loading">Cargando dispositivos...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="iot-grid">
      <pv-card
          v-for="device in devices"
          :key="device.deviceId"
          class="iot-card-style"
      >
        <template #content>
          <!-- Nombre dinámico basado en el tipo de dispositivo -->
          <h4 class="device-name">
            {{ device.deviceType === "Sensor" ? "Environment Collector" : "Irrigation Controller" }}
          </h4>
          <img
              :src="getSensorImage(device.deviceType)"
              alt="Device Image"
              class="sensor-image"
          />
          <div class="iot-info">
            <p><strong>Device Type:</strong> {{ device.deviceType || "N/A" }}</p>
            <p>
              <strong>Status:</strong>
              <pv-button
                  :label="device.status || 'N/A'"
                  :class="getStatusClass(device.status)"
                  :style="{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontStyle: 'italic' }"
                  @click="openUpdateDialog(device)"
              />
            </p>
            <p><strong>Last Sync:</strong> {{ formatDate(device.lastSyncDate) || "N/A" }}</p>
            <div v-if="device.deviceType === 'Sensor'">
              <p><strong>Humidity:</strong> {{ device.humidity || 0 }}%</p>
              <p><strong>Temperature:</strong> {{ device.temperature || 0 }}°C</p>
              <p><strong>Soil Moisture:</strong> {{ device.soilMoisture || 0 }}%</p>
            </div>
          </div>
        </template>
      </pv-card>

      <pv-card class="iot-card-style add-device-card" @click="openAddDeviceDialog">
        <template #content>
          <div class="add-device-content">
            <i class="pi pi-plus add-icon"></i>
            <p class="add-text">Add IoT device</p>
          </div>
        </template>
      </pv-card>
    </div>

    <add-devices-dialog
        ref="addDialog"
        :sowingId="sowingId"
        @device-added="loadDevices"
    />

    <update-devices-dialog
        v-model:visible="showUpdateDialog"
        :device="selectedDevice"
        @device-updated="updateDeviceInList"
    />
  </div>
</template>

<style scoped>


.iot-title {
  text-align: center;

  font-weight: bold;
  font-size: 1.5rem;
}
.iot-card-style {
  width: 300px;
  border-radius: 25px;
  text-align: center;

  border: 2px solid #3E7C59;
}

.device-name {
  color: #3E7C59;

}

.iot-info p {
  margin: 0.2rem 0;
  color: #333;
  text-align: left;
}

.add-device-card {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border: 2px dashed #3E7C59;
  cursor: pointer;
}

.add-device-content {
  text-align: center;
}

.add-icon {
  font-size: 3rem;
  color: #3E7C59;
}

.add-text {
  margin-top: 0.5rem;
  font-size: 1.2rem;
  color: #3E7C59;
  font-weight: bold;
}

.sensor-image {
  width: 100px;
  height: 100px;
  margin: 0 auto 1rem;
  display: block;
}

.status-active {
  background-color: #4caf50;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.status-inactive {
  background-color: #f44336;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.status-disconnected {
  background-color: #9e9e9e;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}
</style>

<style scoped>
.iot-container {
  padding: 1rem;
}

.iot-title {
  text-align: center;
  margin-bottom: 1rem;
  font-weight: bold;
  font-size: 1.5rem;
}

.iot-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 1rem;
}

.iot-card-style {
  width: 300px;
  border-radius: 25px;
  text-align: center;
  padding: 1rem;
}

.device-name {
  color: #3E7C59;
  margin-bottom: 0.5rem;
}

.iot-info p {
  margin: 0.2rem 0;
  color: #333;
  text-align: left;
}

.add-device-card {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border: 2px dashed #3E7C59;
  cursor: pointer;
}

.add-device-content {
  text-align: center;
}

.add-icon {
  font-size: 3rem;
  color: #3E7C59;
}

.add-text {
  margin-top: 0.5rem;
  font-size: 1.2rem;
  color: #3E7C59;
  font-weight: bold;
}

.sensor-image {
  width: 100px;
  height: 100px;
  margin: 0 auto 1rem;
  display: block;
}
.status-active {
  background-color: #4caf50;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.status-inactive {
  background-color: #f44336;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.status-disconnected {
  background-color: #9e9e9e;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}
.status-active,
.status-inactive,
.status-disconnected {
  background-color: #4caf50;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  margin-left: 0.5rem;
  font-style: italic;
}

.status-inactive {
  background-color: #f44336;
}

.status-disconnected {
  background-color: #9e9e9e;
}
</style>