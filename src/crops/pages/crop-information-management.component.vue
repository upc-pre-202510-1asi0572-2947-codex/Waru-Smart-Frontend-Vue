<script>
import GeneralInformation from "../components/general-information.component.vue";
import CropCare from "../components/iot-devices.component.vue";


export default {
  name: "Sowing-information-management",
  components: { CropCare, GeneralInformation },
  data() {
    return {
      selectedSowingId: this.$route.params.sowingId,
      selectedCropId: this.$route.params.cropId,
    };
  },
  watch: {
    '$route.params.sowingId': {
      immediate: true,
      handler(newVal) {
        this.selectedSowingId = newVal;
      }
    },
    '$route.params.cropId': {
      immediate: true,
      handler(newVal) {
        this.selectedCropId = newVal;
      }
    }
  }
}
</script>

<template>
  <div class="sowing-information-management">
    <h2 style="color:black;">{{$t('Sowing information management')}}</h2>
    <pv-tab-view>
      <pv-tab-panel header="General Information">
        <general-information :sowing-id="selectedSowingId" :crop-id="selectedCropId" />
      </pv-tab-panel>
      <pv-tab-panel header="IoT Devices">
        <crop-care :sowing-id="selectedSowingId" :crop-id="selectedCropId" />
      </pv-tab-panel>
    </pv-tab-view>
  </div>
</template>

<style scoped>

</style>