<template>
  <div class="analytics-card">
    <!-- Header Section -->
    <div class="card-header">
      <div class="header-content">
        <h3 class="card-title">Daily Analytics</h3>
        <p class="card-subtitle">Environmental trends over time</p>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="filter-group">
        <label for="zone" class="filter-label">Zone:</label>
        <input
            id="zone"
            v-model="zone"
            placeholder="Enter zone (e.g., C)"
            class="filter-input"
            :disabled="isLoading"
        />
      </div>

      <div class="filter-group">
        <label for="days" class="filter-label">Days:</label>
        <input
            id="days"
            type="number"
            v-model="days"
            placeholder="Enter number of days"
            class="filter-input"
            min="1"
            max="365"
            :disabled="isLoading"
        />
      </div>

      <button
          @click="fetchData"
          class="apply-btn"
          :disabled="isLoading"
      >
        Apply Filters
      </button>
    </div>

    <!-- Chart Section -->
    <div class="chart-container">
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading data...</p>
      </div>

      <div v-else-if="!hasData" class="empty-state">
        <p>No data available</p>
        <button @click="fetchData" class="retry-btn">Try Again</button>
      </div>

      <Chart
          v-else
          type="line"
          :data="chartData"
          :options="chartOptions"
          class="analytics-chart"
      />
    </div>
  </div>
</template>

<script>
import Chart from 'primevue/chart';
import { AnalyticsApiService } from "../services/analytics-api.service.js";

export default {
  components: {
    Chart
  },
  data() {
    return {
      chartData: null,
      chartOptions: null,
      zone: "A",
      days: 2,
      isLoading: false,
      hasData: true,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.isLoading = true;
      const analyticsApiService = new AnalyticsApiService();
      try {
        const response = await analyticsApiService.getDailyAverages(this.zone, this.days);
        console.log("Datos recibidos:", response.data);
        if (response?.data && Array.isArray(response.data)) {
          this.hasData = response.data.length > 0;
          this.setupChart(response.data);
        } else {
          this.hasData = false;
          this.setupChart([]);
        }
      } catch (error) {
        console.error("Error fetching daily averages:", error);
        this.hasData = false;
        this.setupChart([]);
      } finally {
        this.isLoading = false;
      }
    },
    setupChart(data) {
      if (data.length === 0) {
        this.chartData = {
          labels: [],
          datasets: []
        };
        return;
      }

      const labels = data.map(item => this.formatTimestamp(item.date));
      const avgTemperatureData = data.map(item => item.avgTemperature);
      const avgHumidityData = data.map(item => item.avgHumidity);
      const avgSoilMoistureData = data.map(item => item.avgSoilMoisture);

      this.chartData = {
        labels,
        datasets: [
          {
            label: 'Average Temperature',
            backgroundColor: '#42A5F5',
            borderColor: '#1E88E5',
            data: avgTemperatureData,
            fill: false,
            tension: 0.4
          },
          {
            label: 'Average Humidity',
            backgroundColor: '#9CCC65',
            borderColor: '#7CB342',
            data: avgHumidityData,
            fill: false,
            tension: 0.4
          },
          {
            label: 'Average Soil Moisture',
            backgroundColor: '#FFA726',
            borderColor: '#FB8C00',
            data: avgSoilMoistureData,
            fill: false,
            tension: 0.4
          }
        ]
      };

      this.chartOptions = {
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
              color: '#495057',
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0
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
    },
    formatTimestamp(timestamp) {
      if (!timestamp) return null;
      const date = new Date(timestamp);
      return date.toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour12: true,
        timeZone: "UTC",
      });
    }
  }
};
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

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.filters-section {
  display: flex;
  gap: 16px;
  align-items: end;
  margin-bottom: 20px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-label {
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.filter-input {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  transition: border-color 0.2s ease;
  min-width: 120px;
}

.filter-input:focus {
  outline: none;
  border-color: #42A5F5;
}

.filter-input:disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.apply-btn {
  background: #42A5F5;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;
  white-space: nowrap;
}

.apply-btn:hover:not(:disabled) {
  background: #1E88E5;
}

.apply-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

  .filters-section {
    flex-direction: column;
    gap: 12px;
  }

  .filter-group {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  .filter-label {
    min-width: 60px;
  }

  .filter-input {
    flex: 1;
  }

  .analytics-chart {
    height: 400px;
  }
}
</style>