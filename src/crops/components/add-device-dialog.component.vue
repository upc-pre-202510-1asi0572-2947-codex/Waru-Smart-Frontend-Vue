<script>
import { SowingsDevicesApiService } from "../services/sowing-devices-api.service.js";

export default {
  name: "add-devices-dialog",
  props: {
    sowingId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      showDialog: false,
      form: {
        deviceId: "",
        deviceType: "", // Nuevo campo
        location: "",
        status: "Disconnected", // Estado predeterminado
      },
      deviceTypeOptions: [
        { label: "Enviroment Collector", value: "EnvironmentCollector" },
        { label: "Irrigation Controller", value: "IrrigationController" },
      ],
      loading: false,
      error: null,
    };
  },
  methods: {
    async addDevice() {
      console.log("Received Sowing ID:", this.sowingId);
      console.log("Form data:", this.form);

      if (!this.form.deviceId || !this.form.deviceType || !this.form.location) {
        this.error = "All fields are required.";
        return;
      }

      this.loading = true;
      this.error = null;

      const sowingsDevicesService = new SowingsDevicesApiService();
      try {
        await sowingsDevicesService.addDeviceToSowing(this.sowingId, {
          ...this.form,
          sowingId: this.sowingId,
        });
        this.$emit("device-added");
        this.closeDialog();
      } catch (error) {
        this.error = "Error adding the device.";
        console.error("Error details:", error.response?.data || error.message);
      } finally {
        this.loading = false;
      }
    },
    closeDialog() {
      this.showDialog = false;
      this.resetForm();
    },
    resetForm() {
      this.form = {
        deviceId: "",
        deviceType: "", // Restablecer el nuevo campo
        location: "",
        status: "Disconnected", // Estado predeterminado
      };
      this.error = null;
    },
  },
};
</script>

<template>
  <pv-dialog
      v-model:visible="showDialog"
      modal
      header="Add IoT Device"
      :style="{ width: '30vw' }"
      @hide="closeDialog"
  >
    <div v-if="error" class="error-message">{{ error }}</div>
    <form @submit.prevent="addDevice">
      <!-- Campo para Device ID -->
      <div class="form-group">
        <label for="deviceId">Device ID:</label>
        <pv-input-text
            id="deviceId"
            v-model="form.deviceId"
            type="text"
            placeholder="Enter device ID"
        />
      </div>
      <!-- Campo para Device Type -->
      <div class="form-group">
        <label for="deviceType">Device Type:</label>
        <pv-dropdown
            id="deviceType"
            v-model="form.deviceType"
            :options="deviceTypeOptions"
            option-label="label"
            option-value="value"
            placeholder="Select a device type"
        />
      </div>
      <!-- Campo para Location -->
      <div class="form-group">
        <pv-label for="location">Location:</pv-label>
        <pv-input-text id="location" v-model="form.location" type="text" placeholder="Example: center"/>
      </div>
      <div class="form-actions">
        <pv-button label="Cancel" @click="closeDialog" :style="{ backgroundColor: '#f44336', color: '#fff' }"
        />
        <pv-button label="Add" :disabled="loading" :class="{ loading: loading }" type="submit" :style="{ backgroundColor: '#4CAF50', color: '#fff' }"
        />
      </div>
    </form>
  </pv-dialog>
</template>

<style scoped>
.error-message {
  color: red;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.form-group select,
.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.loading {
  opacity: 0.6;
  pointer-events: none;
}
</style>