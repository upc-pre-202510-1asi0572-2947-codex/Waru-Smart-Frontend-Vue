<template>
  <div class="report-container">
    <div class="report-header">
      <h2>Environment Report</h2>
      <button @click="refreshData" :disabled="loading" class="refresh-btn">
        <svg class="refresh-icon" :class="{ 'animate-spin': loading }" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
        </svg>
        Refresh
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="refreshData" class="retry-btn">Try Again</button>
    </div>

    <div v-else class="report-content">
      <!-- Device Status -->
      <Card class="report-card">
        <template #title>Device Status</template>
        <template #content>
          <div class="status-grid">
            <div class="status-item">
              <span class="status-label">Active</span>
              <span class="status-value">{{ deviceStatus.activeDevices }}</span>
            </div>
            <div class="status-item">
              <span class="status-label">Inactive</span>
              <span class="status-value">{{ deviceStatus.inactiveDevices }}</span>
            </div>
            <div class="status-item">
              <span class="status-label">Total</span>
              <span class="status-value">{{ deviceStatus.totalDevices }}</span>
            </div>
            <div class="status-item">
              <span class="status-label">Active Rate</span>
              <span class="status-value">{{ deviceStatus.activePercentage }}%</span>
            </div>
          </div>
        </template>
      </Card>

      <!-- Device Counts -->
      <Card class="report-card">
        <template #title>Device Reading Counts</template>
        <template #content>
          <div class="device-list">
            <div v-for="(device, index) in deviceCounts" :key="index" class="device-item">
              <span>Device {{ device.deviceIdValue }}</span>
              <span>{{ device.count }} readings</span>
            </div>
          </div>
        </template>
      </Card>

      <!-- Device Last Values -->
      <Card class="report-card">
        <template #title>Latest Device Readings</template>
        <template #content>
          <div class="readings-list">
            <div v-for="(device, index) in deviceLastValues" :key="index" class="reading-item">
              <div class="reading-header">
                <strong>Device {{ device.deviceIdValue }}</strong>
                <span class="timestamp">{{ formatTimestamp(device.timestamp) }}</span>
              </div>
              <div class="reading-values">
                <span>Temperature: {{ device.temperatureValue }}°C</span>
                <span>Humidity: {{ device.humidity }}%</span>
                <span>Soil Moisture: {{ device.soilMoistureValue }}%</span>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import Card from 'primevue/card';
import { AnalyticsApiService } from "../services/analytics-api.service.js";

export default {
  name: "environment-report",
  components: { Card },
  data() {
    return {
      deviceCounts: null,
      deviceLastValues: null,
      deviceStatus: null,
      loading: true,
      error: null,
    };
  },
  methods: {
    async fetchData() {
      const analyticsApiService = new AnalyticsApiService();
      try {
        this.loading = true;
        this.error = null;
        const [counts, lastValues, status] = await Promise.all([
          analyticsApiService.getDeviceCounts(),
          analyticsApiService.getDeviceLastValues(),
          analyticsApiService.getDeviceStatus(),
        ]);
        this.deviceCounts = counts.data;
        this.deviceLastValues = lastValues.data;
        this.deviceStatus = status.data;
      } catch (err) {
        this.error = "Error fetching report data";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async refreshData() {
      await this.fetchData();
    },
    formatTimestamp(timestamp) {
      if (!timestamp) return null;
      const date = new Date(timestamp);
      return date.toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "UTC",
      });
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
.report-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.report-header h2 {
  margin: 0;
  font-size: 24px;
  color: #374151;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.refresh-btn:hover:not(:disabled) {
  background: #e5e7eb;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-icon {
  width: 16px;
  height: 16px;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  gap: 12px;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #42A5F5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-state p {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

.error-state p {
  color: #dc2626;
  font-size: 14px;
  margin: 0;
}

.retry-btn {
  background: #42A5F5;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.retry-btn:hover {
  background: #1E88E5;
}

.report-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.report-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
}

.status-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
  text-transform: uppercase;
}

.status-value {
  font-size: 20px;
  font-weight: 600;
  color: #374151;
}

.device-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.device-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 6px;
}

.readings-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reading-item {
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
}

.reading-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.timestamp {
  font-size: 12px;
  color: #6b7280;
}

.reading-values {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.reading-values span {
  font-size: 14px;
  color: #374151;
}

@media (max-width: 768px) {
  .report-container {
    padding: 16px;
  }

  .report-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .status-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>