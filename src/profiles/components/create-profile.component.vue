<script>
import { ProfileApiService } from "../service/profile-api.service.js";
import { Profile2 } from "../model/profile.entity.js";

const profileApiService = new ProfileApiService();

export default {
  data() {
    return {
      newName: '',
      newSubscription: '',
      newEmail: '',
      newCountry: null,
      newCity: null,
      countries: [
        { id: 1, name: 'Chile', cities: ['Santiago', 'Antofagasta', 'Concepción'] },
        { id: 2, name: 'Colombia', cities: ['Bogotá', 'Barranquilla', 'Medellin'] },
        { id: 3, name: 'Ecuador', cities: ['Guayaquil', 'Quito', 'Cuenca'] },
        { id: 4, name: 'Perú', cities: ['Lima', 'Arequipa', 'Trujillo'] },
      ],
      allCities: [
        { id: 1, name: 'Santiago', countryId: 1 },
        { id: 2, name: 'Antofagasta', countryId: 1 },
        { id: 3, name: 'Concepción', countryId: 1 },
        { id: 4, name: 'Bogotá', countryId: 2 },
        { id: 5, name: 'Barranquilla', countryId: 2 },
        { id: 6, name: 'Medellin', countryId: 2 },
        { id: 7, name: 'Guayaquil', countryId: 3 },
        { id: 8, name: 'Quito', countryId: 3 },
        { id: 9, name: 'Cuenca', countryId: 3 },
        { id: 10, name: 'Lima', countryId: 4 },
        { id: 11, name: 'Arequipa', countryId: 4 },
        { id: 12, name: 'Trujillo', countryId: 4 },
      ],
      cities: []
    };
  },
  watch: {
    newCountry(newVal) {
      this.updateCities(newVal);
    }
  },
  methods: {
    saveEmailChange(newEmail) {
      const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
      if (emailRegex.test(newEmail)) {
        this.boolEmail = true;
      } else {
        alert('Please enter a valid email address');
      }
    },
    confirmApply() {
      const profile = new Profile2(this.newName, '', this.newEmail, this.newCity, this.newCountry, this.newCountry);

      console.log(profile);

      profileApiService.create(profile).then(response => {
        console.log(response);
        this.$router.push('/membership-selector');
      }).catch(error => {
        console.error('Error getting prof:', error);
        alert('Error al actualizar.');
      });
    },
    signOut() {
    },
    updateCities(countryId) {
      this.cities = this.allCities.filter(city => city.countryId === countryId);
    }
  },
};
</script>

<template>
  <div class="smaller-div">
    <pv-card class="highlighted-border">
      <template #title>
        <div class="profile-header">
          <br>
          <h2 class="black">Create Profile</h2>
        </div>
      </template>
      <template #content>
        <div class="profile-content">
          <div class="profile-image">
            <img class="rounded-full large-image" alt="avatar" src="https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg">
          </div>
          <div class="profile-details">
            <h3>Name:</h3>
            <pv-input-text v-model="newName" />
            <pv-divider/>
            <h3>Email:</h3>
            <pv-input-text v-model="newEmail" />
            <pv-divider/>
            <h3>Country:</h3>
            <pv-dropdown v-model="newCountry" :options="countries" optionLabel="name" optionValue="id" />
            <pv-divider/>
            <h3>City:</h3>
            <pv-dropdown v-model="newCity" :options="cities" optionLabel="name" optionValue="id" />
            <pv-divider/>
            <pv-button class="green-button" @click="confirmApply">Apply</pv-button>
          </div>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>
.highlighted-border {
  border: 2px solid #000;
}
.red-button {
  background-color: #FF3439;
}
.green-button {
  background-color: #005f40;
}
.smaller-div {
  width: 55rem;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  display: block;
}

.large-image {
  height: 250px;
  width: 250px;
  border-radius: 50%;
}

.black{
  color: black;
}

.profile-content {
  display: flex;
  justify-content: space-between;
}

.profile-image {
  flex: 1;
}

.profile-details {
  flex: 2;
}
</style>