<script>

export default {
  name: "CropEnviromentInformation",
  props: ["sowingId"],
  data(){
    return{
      humidity: null,
      temperature: null,
      date: null
    }
  },
  watch:{
    sowingId: {
      immediate: true,
      handler(newVal, oldVal) {
        console.log("sowingId changed from", oldVal, "to", newVal);
        this.getEnviromentData();
      },
    }
  },
  methods: {
    async getEnviromentData(){
      if (!this.sowingId) {
        this.humidity = 1;
        this.temperature = 10;
        this.date = new Date(Date.now());
        return;
      }
      //TODO: Conectar al backend para buscar el sowing segun su id
      this.humidity = 10;
      this.temperature = 100;
      this.date = new Date(Date.now());
    }
  }
};

</script>

<template>
  <div>
    <h2>{{$t("LastUpdate")}}: {{this.date}} </h2>
    <hr>
    <h3>{{$t("EnviromentHumidity")}}: {{this.humidity}} </h3>
    <h3>{{$t("EnviromentTemperature")}}: {{this.temperature}} </h3>
  </div>
</template>

<style scoped>

</style>