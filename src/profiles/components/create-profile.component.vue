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
  <div class="profile-wrapper">
    <pv-card class="profile-card">
      <template #title>
        <div class="profile-header">
          <h1 class="profile-title">{{ $t('createProfile') }}</h1>
        </div>
      </template>
      <template #content>
        <div class="profile-content">
          <!-- Columna de la imagen -->
          <div class="profile-image-column">
            <img class="profile-avatar" alt="avatar" src="https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg">
          </div>

          <!-- Columna de los formularios -->
          <div class="profile-form-column">
            <!-- Fila de Nombre y Email -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">{{ $t('name') }}:</label>
                <div class="input-group">
                  <pv-input-text v-model="newName" class="form-input" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">{{ $t('email') }}:</label>
                <div class="input-group">
                  <pv-input-text v-model="newEmail" class="form-input" />
                </div>
              </div>
            </div>

            <!-- Línea divisoria -->
            <hr class="divider" />

            <!-- Fila de País y Ciudad -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">{{ $t('country') }}:</label>
                <div class="input-group">
                  <pv-dropdown v-model="newCountry" :options="countries" optionLabel="name" optionValue="id" class="form-input" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">{{ $t('city') }}:</label>
                <div class="input-group">
                  <pv-dropdown v-model="newCity" :options="cities" optionLabel="name" optionValue="id" class="form-input" />
                </div>
              </div>
            </div>

            <!-- Botón de acción -->
            <div class="button-container">
              <pv-button class="apply-button" @click="confirmApply">{{ $t('apply') }}</pv-button>
            </div>
          </div>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>
.profile-wrapper {
  width: 100%;
  max-width: 1000px;
  margin: 20px auto;
}

.profile-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.profile-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
  text-align: center;
  background-color: #f8f9fa;
}

.profile-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.profile-content {
  display: flex;
  padding: 20px;
  gap: 30px;
}

.profile-image-column {
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.profile-avatar {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 3px solid #f0f0f0;
}

.profile-form-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-group {
  flex: 1;
  min-width: 0;
}

.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #555;
}

.input-group {
  display: flex;
  align-items: center;
}

.form-input {
  flex: 1;
  min-width: 0;
}

.divider {
  border: none;
  border-top: 1px solid #eee;
  margin: 0;
}

.button-container {
  display: flex;
  margin-top: 10px;
}

.apply-button {
  background-color: #005f40;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .profile-content {
    flex-direction: column;
  }

  .form-row {
    flex-direction: column;
  }
}
</style>