<template>
  <div class="analytics-card">
    <!-- Header Section -->
    <div class="card-header">
      <div class="header-content">
        <h3 class="card-title">Zone Analytics</h3>
        <p class="card-subtitle">Environmental averages by zone</p>
      </div>
      <button
          @click="refreshData"
          :disabled="isLoading"
          class="refresh-btn"
      >
        <svg class="refresh-icon" :class="{ 'animate-spin': isLoading }" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
        </svg>
        Refresh
      </button>
    </div>

    <!-- Chart Section -->
    <div class="chart-container">
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading data...</p>
      </div>

      <div v-else-if="hasError" class="error-state">
        <p class="error-message">{{ errorMessage }}</p>
        <button @click="refreshData" class="retry-btn">Try Again</button>
      </div>

      <div v-else-if="!hasData" class="empty-state">
        <p>No data available</p>
      </div>

      <Chart
          v-else
          type="bar"
          :data="chartData"
          :options="chartOptions"
          class="analytics-chart"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Chart from "primevue/chart";
import { AnalyticsApiService } from "../services/analytics-api.service.js";

// Reactive state
const chartData = ref(null);
const chartOptions = ref(null);
const rawData = ref([]);
const isLoading = ref(false);
const hasError = ref(false);
const errorMessage = ref("");

// Service instance
const analyticsApiService = new AnalyticsApiService();

// Computed properties
const hasData = computed(() => rawData.value && rawData.value.length > 0);

// Chart configuration
const setupChart = (data) => {
  const labels = data.map(item => `${item.zone} (${item.count})`); // Agregar count al lado del nombre de la zona
  const avgTemperatureData = data.map(item => item.avgTemperature);
  const avgHumidityData = data.map(item => item.avgHumidity);
  const avgSoilMoistureData = data.map(item => item.avgSoilMoisture);

  chartData.value = {
    labels: labels,
    datasets: [
      {
        label: 'Average Temperature',
        backgroundColor: '#42A5F5',
        borderColor: '#1E88E5',
        data: avgTemperatureData
      },
      {
        label: 'Average Humidity',
        backgroundColor: '#9CCC65',
        borderColor: '#7CB342',
        data: avgHumidityData
      },
      {
        label: 'Average Soil Moisture',
        backgroundColor: '#FFA726',
        borderColor: '#FB8C00',
        data: avgSoilMoistureData
      }
    ]
  };

  chartOptions.value = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          color: '#495057'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#495057'
        },
        grid: {
          display: false
        }
      },
      y: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      }
    }
  };
};

// Data fetching function
const fetchData = async () => {
  try {
    isLoading.value = true;
    hasError.value = false;
    errorMessage.value = "";

    const response = await analyticsApiService.getZoneAverages();

    if (response?.data && Array.isArray(response.data)) {
      rawData.value = response.data;
      setupChart(response.data);
    } else {
      rawData.value = [];
    }
  } catch (error) {
    console.error("Error fetching zone averages data:", error);
    hasError.value = true;
    errorMessage.value = error.message || "Failed to load data";
  } finally {
    isLoading.value = false;
  }
};

// Refresh data function
const refreshData = async () => {
  await fetchData();
};

// Initialize on component mount
onMounted(fetchData);
</script>

<style scoped>
.analytics-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.header-content {
  flex: 1;
}

.card-title {
  color: #374151;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.card-subtitle {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;
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

.chart-container {
  position: relative;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
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

.error-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  text-align: center;
  gap: 12px;
}

.error-message {
  color: #dc2626;
  font-size: 14px;
  margin: 0;
}

.empty-state p {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

.retry-btn {
  background: #42A5F5;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;
}

.retry-btn:hover {
  background: #1E88E5;
}

.analytics-chart {
  height: 480px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .analytics-card {
    padding: 16px;
  }

  .card-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .analytics-chart {
    height: 400px;
  }
}
</style>