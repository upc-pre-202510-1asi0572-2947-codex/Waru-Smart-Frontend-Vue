<template>
  <pv-dialog
      :visible="visible"
      modal
      header="Update Device"
      :closable="true"
      :style="{ width: '450px' }"
      @update:visible="$emit('update:visible', $event)"
      class="update-device-dialog"
  >
    <div class="device-info">
      <div class="info-row">
        <span class="info-label">Device Name:</span>
        <span class="info-value">{{ device?.name || "N/A" }}</span>
      </div>

      <div class="info-row">
        <span class="info-label">Current Status:</span>
        <span class="info-value status-badge" :class="device?.status?.toLowerCase()">
          {{ device?.status || 'N/A' }}
        </span>
      </div>

      <div class="info-row dropdown-row">
        <span class="info-label">New Status:</span>
        <pv-dropdown
            v-model="selectedStatus"
            :options="filteredStatuses"
            option-label="label"
            option-value="value"
            placeholder="Select a status"
            class="status-dropdown"
        />
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <pv-button
            label="Cancel"
            class="p-button-danger"
            style="background-color: #f44336; border-color: #f44336; color: white;"
            @click="$emit('update:visible', false)"
        />
        <pv-button
            label="Update"
            class="p-button-success"
            style="background-color: #4caf50; border-color: #4caf50; color: white;"
            :disabled="!selectedStatus || selectedStatus === device?.status"
            @click="updateDeviceStatus"
        />
      </div>
    </template>
  </pv-dialog>
</template>

<script>
import { SowingsDevicesApiService } from "../services/sowing-devices-api.service.js";

const sowingsDevicesApiService = new SowingsDevicesApiService();

export default {
  name: "UpdateDeviceDialog",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    device: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      statuses: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
        { label: "Disconnected", value: "Disconnected" },
      ],
      selectedStatus: null,
    };
  },
  watch: {
    visible(newValue) {
      if (newValue) {
        this.selectedStatus = null;
      }
    }
  },
  computed: {
    filteredStatuses() {
      return this.statuses.filter(status => status.value !== this.device?.status);
    },
  },
  methods: {
    async updateDeviceStatus() {
      if (this.selectedStatus && this.selectedStatus !== this.device.status) {
        try {
          const deviceData = { status: this.selectedStatus };
          await sowingsDevicesApiService.updateDevice(this.device.id, deviceData);
          this.$emit("update:visible", false);
          this.$emit("device-updated", { ...this.device, status: this.selectedStatus });
        } catch (error) {
          console.error("Error updating device:", error);
          if (error.response) {
            console.error("Error details:", error.response.data);
          }
        }
      } else {
        console.warn("Selected status is invalid or unchanged");
      }
    },
  },
};
</script>

<style scoped>
.device-info {
  margin: 1rem 0;
}

.info-row {
  display: flex;
  margin-bottom: 1rem;
  align-items: center;
}

.info-label {
  font-weight: 600;
  width: 120px;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  display: inline-block;
}

.status-badge.active {
  background-color: #dcf5e3;
  color: #1e9953;
}

.status-badge.disconnected {
  background-color: #f2f2f2;
  color: #666;
}

.status-badge.inactive {
  background-color: #ffecec;
  color: #e74c3c;
}

.dropdown-row {
  align-items: flex-start;
}

.status-dropdown {
  min-width: 200px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>