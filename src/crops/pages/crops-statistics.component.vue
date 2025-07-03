
<script>
import CropsAmountStatsCard from '/src/crops/components/crops-amount-stats-card.component.vue';
import ControlsByCropStats from '/src/crops/components/controls-by-crop-stats-card.component.vue';
import DeviceTypeGeneralStatisticCard from '/src/crops/components/device-type-general-statistic-card.component.vue';
import GeneralInformation from "../components/general-information.component.vue";
import CropCare from "../components/iot-devices.component.vue";

import ReportProductivityComponent from "../components/report-productivity.component.vue";
import ProductivityReport from "../components/report-productivity.component.vue";
import ReportWaterConsumptionComponent from "../components/report-water-consumption.component.vue";
import ReportEnviromentComponent from "../components/report-enviroment.component.vue";
import ReportTendenciesAndRecomendationsComponent from "../components/report-tendencies-and-recomendations.component.vue";
import WaterConsumptionReport from "../components/report-water-consumption.component.vue";
import EnviromentReport from "../components/report-enviroment.component.vue";
import TendenciesAndRecomendationsReport from "../components/report-tendencies-and-recomendations.component.vue";

export default {
  name: "crops-statistics",
  components: {
    TendenciesAndRecomendationsReport,
    EnviromentReport,
    WaterConsumptionReport,
    ProductivityReport,
    CropCare, GeneralInformation,
    CropsAmountStatsCard,
    //ControlsByCropStats
    DeviceTypeGeneralStatisticCard,
    ReportProductivityComponent, ReportWaterConsumptionComponent, ReportEnviromentComponent, ReportTendenciesAndRecomendationsComponent
  },
  data() {
    return {
      activeTab: this.$route.params.tab || "Crop-Productivity", // Pestaña activa por defecto
    };
  },
  watch: {
    activeTab(newTab) {
      // Actualiza la ruta según la pestaña activa
      this.$router.replace(`sowing-statistics-reports/${newTab}`);
    },
    '$route.params.tab': {
      immediate: true,
      handler(newTab) {
        this.activeTab = newTab || "Crop-Productivity";
      }
    }
  }
}
</script>

<template>
  <h1>{{$t('welcomeStatistics')}}</h1>
  <pv-tab-view v-model:active-tab="activeTab">
    <pv-tab-panel header="Crop Productivity" name="Crop-Productivity">
      <productivity-report></productivity-report>
    </pv-tab-panel>
    <pv-tab-panel header="Enviroment Report" name="Enviroment-Report">
      <enviroment-report></enviroment-report>
    </pv-tab-panel>
    <pv-tab-panel header="Water Consume Report" name="Water-Consume-Report">
      <water-consumption-report></water-consumption-report>
    </pv-tab-panel>
    <pv-tab-panel header="Tendencies and Recomendations" name="Tendencies-and-recomendations">
      <tendencies-and-recomendations-report></tendencies-and-recomendations-report>
    </pv-tab-panel>
  </pv-tab-view>

</template>


<style scoped>
.flex-container {
  display: flex;
  justify-content: space-between;
}

h1{
  color:black;
  font-size: 2.7rem;
  margin-bottom:10%;
}

@media (max-width: 768px) {
  .flex-container {
    flex-direction: column;
    height: 100vh;
    justify-content: revert-layer;
  }
}
</style>