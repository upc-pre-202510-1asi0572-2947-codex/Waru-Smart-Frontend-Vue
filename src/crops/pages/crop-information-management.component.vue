<script>
import GeneralInformation from "../components/general-information.component.vue";
import CropCare from "../components/iot-device.component.vue";

export default {
  name: "Sowing-information-management",
  components: {CropCare, GeneralInformation},
  data() {
    return {
      selectedSowingId: this.$route.params.sowingId,
      selectedCropId: this.$route.params.cropId,
      activeTab: this.$route.params.tab || "General-Information", // Pestaña activa por defecto
    };
  },
  watch: {
    activeTab(newTab) {
      // Actualiza la ruta según la pestaña activa
      this.$router.replace(`/crop/${this.selectedCropId}/sowing/${this.selectedSowingId}/${newTab}`);
    },
    '$route.params.tab': {
      immediate: true,
      handler(newTab) {
        this.activeTab = newTab || "General-Information";
      }
    }
  }
};
</script>

<template>
  <div class="sowing-information-management">
    <h2 style="color:black;">{{ $t('Sowing information management') }}</h2>
    <pv-tab-view v-model:active-tab="activeTab">
      <pv-tab-panel header="General Information" name="General-Information">
        <general-information :sowing-id="selectedSowingId" :crop-id="selectedCropId"/>
      </pv-tab-panel>
      <pv-tab-panel header="IoT Devices" name="IoT-devices">
        <crop-care :sowing-id="selectedSowingId" :crop-id="selectedCropId"/>
      </pv-tab-panel>
    </pv-tab-view>
  </div>
</template>