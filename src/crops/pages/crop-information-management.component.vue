<script>
import GeneralInformation from "../components/general-information.component.vue";
import CropCare from "../components/crop-care.component.vue";
import DiseasesOrPests from "../components/diseases-or-pests.component.vue";
import ProductsUsed from "../components/products-used.component.vue";
import Controls from "../components/controls.component.vue";

export default {
  name: "Sowing-information-management",
  components: { ProductsUsed, DiseasesOrPests, Controls, CropCare, GeneralInformation },
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
  <div>
    <h2 style="color:black;">{{$t('Sowing information management')}}</h2>
    <pv-tab-view>
      <pv-tab-panel header="General Information">
        <general-information :sowing-id="selectedSowingId" :crop-id="selectedCropId" />
      </pv-tab-panel>
      <pv-tab-panel header="Crop Care">
        <crop-care :sowing-id="selectedSowingId" :crop-id="selectedCropId" />
      </pv-tab-panel>
      <pv-tab-panel header="Controls">
        <controls :sowing-id="selectedSowingId" :crop-id="selectedCropId" />
      </pv-tab-panel>
      <pv-tab-panel header="Diseases or Pest">
        <diseases-or-pests :sowing-id="selectedSowingId" :crop-id="selectedCropId" />
      </pv-tab-panel>
      <pv-tab-panel header="Products Used">
        <products-used :sowing-id="Number(selectedSowingId)" :crop-id="Number(selectedCropId)" />
      </pv-tab-panel>
    </pv-tab-view>
  </div>
</template>