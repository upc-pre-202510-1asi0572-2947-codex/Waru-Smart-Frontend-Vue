<script>
import { SowingsApiService } from "../services/sowings-api.service.js";
import { CropsRecomendationApiService } from "../services/crops-recomendation-api.service.js";
import { Sowing } from "../models/sowing.entity.js";
import { FilterMatchMode } from "primevue/api";

export default {
  name: 'crop-history',
  data() {
    return {
      sowings: [],
      selectedSowing: {},
      selectedSowingDetailsVisible: false,
      filters: {},
      sowingService: null,
      crop: null,
      isUnmounted: false,
    };
  },
  methods: {
    initFilters() {
      this.filters = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } };
    },
    showSowingDetails(sowing) {
      if (sowing && sowing.id) {
        this.selectedSowing = sowing;
        this.selectedSowingDetailsVisible = true;
        this.loadSowing(sowing.id);
      }
    },
    async loadSowing(sowingId) {
      if (!sowingId || this.isUnmounted) {
        return;
      }
      try {
        const sowingResponse = await this.sowingService.getById(sowingId);
        if (this.isUnmounted) return;
        this.selectedSowing = sowingResponse.data;
        const cropService = new CropsRecomendationApiService();
        const cropResponse = await cropService.getCropById(this.selectedSowing.cropId);
        if (this.isUnmounted) return;
        this.crop = cropResponse.data;
      } catch (error) {
        if (this.isUnmounted) return;
        console.error('Error loading sowing or crop data:', error);
      }
    },
    closeDialog() {
      this.selectedSowingDetailsVisible = false;
    },
  },
  created() {
    this.sowingService = new SowingsApiService();

    this.sowingService
        .getAll()
        .then((response) => {
          let data;
          if (typeof response.data === 'string') {
            try {
              data = JSON.parse(response.data);
            } catch (error) {
              console.error('Error parsing response.data:', error);
              return;
            }
          } else if (typeof response.data === 'object') {
            data = response.data;
          } else {
            console.error('Unexpected type of response.data:', typeof response.data);
            return;
          }
          console.log('Type of data:', typeof data);
          console.log('Content of data:', data);
          if (Array.isArray(data)) {
            let sowings = data;
            Promise.all(sowings.map((sowing) => Sowing.toDisplayableSowing(sowing)))
                .then((displayableSowings) => {
                  this.sowings = displayableSowings;
                  console.log('Sowings:', this.sowings);
                })
                .catch((error) => {
                  console.error('Error converting sowings to displayable format:', error);
                });
          } else {
            console.error('Error: data is not an array');
          }
        })
        .catch((error) => {
          console.error('Error loading sowings:', error);
        });
    this.initFilters();
  },
  beforeUnmount() {
    this.isUnmounted = true;
  },
};
</script>

<template>
  <div>
    <h1 class="title">Crop History</h1>
    <pv-data-table
        class="table-margin"
        ref="dt"
        :value="sowings"
        v-model:selection="selectedSowing"
        dataKey="id"
        selectionMode="single"
        :paginator="true"
        :rows="5"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
    >
      <template #header>
        <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
          <pv-icon-field iconPosition="left">
            <pv-input-icon>
              <i class="pi pi-search" />
            </pv-input-icon>
            <pv-input-text v-model="filters['global'].value" placeholder="Search..." />
          </pv-icon-field>
        </div>
      </template>
      <pv-column field="crop_name" header="Crop" style="min-width:12rem"></pv-column>
      <pv-column field="start_date" header="Planted Date" style="min-width:16rem"></pv-column>
      <pv-column field="harvest_date" header="Harvest Date" style="min-width:16rem"></pv-column>
      <pv-column header="View record" style="min-width:12rem">
        <template #body="slotProps">
          <pv-button class="green-button" label="See" @click="showSowingDetails(slotProps.data)" />
        </template>
      </pv-column>
    </pv-data-table>
    <pv-dialog
        :visible.sync="selectedSowingDetailsVisible"
        modal
        header="Sowing Details"
        :style="{ width: '500px' }"
        @hide="closeDialog"
        :closable="true"
        :dismissable-mask="true"
    >
      <div class="flex flex-column align-items-center" v-if="crop && selectedSowing">
        <h2>{{ crop.name }}</h2>
        <img :src="crop.imageUrl" alt="Crop image" class="dialog-image" />
        <p class="dialog-description">{{ crop.description }}</p>
        <p v-if="selectedSowing.phenologicalPhaseName === 'HarvestReady'">Your crop was a success</p>
        <p v-else>Let's wait to see how it goes!</p>
        <pv-button class="close-button" label="Close" @click="closeDialog" />
      </div>
    </pv-dialog>
  </div>
</template>

<style scoped>
.table-margin {
  margin-top: 20px;
}
.dialog-image {
  width: 50%;
  height: auto;
}
.dialog-description {
  font-size: 1.2em;
  color: #333;
}
.close-button {
  margin-top: 20px;
}
.close-button {
  margin-top: 20px;
  background-color: black;
  color: white;
}
</style>
