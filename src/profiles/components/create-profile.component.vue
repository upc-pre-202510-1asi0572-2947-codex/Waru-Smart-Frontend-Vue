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
            <img class="profile-avatar" alt="avatar"
                 src="https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg">
          </div>

          <!-- Columna del formulario -->
          <div class="profile-form-column">
            <!-- Fila de Nombre y Apellido -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">{{ $t('firstName') }}:</label>
                <div class="input-group">
                  <pv-input-text v-model="newFirstName" class="form-input"/>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">{{ $t('lastName') }}:</label>
                <div class="input-group">
                  <pv-input-text v-model="newLastName" class="form-input"/>
                </div>
              </div>
            </div>

            <!-- Fila de Email -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">{{ $t('email') }}:</label>
                <div class="input-group">
                  <pv-input-text v-model="newEmail" class="form-input"/>
                </div>
              </div>
            </div>

            <!-- Línea divisoria -->
            <hr class="divider"/>

            <!-- Fila de País y Ciudad -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">{{ $t('country') }}:</label>
                <div class="input-group">
                  <pv-dropdown
                      v-model.number="newCountry"
                      :options="countries"
                      optionLabel="name"
                      optionValue="id"
                      placeholder="Selecciona un país"
                      class="form-input"
                  />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">{{ $t('city') }}:</label>
                <div class="input-group">
                  <pv-dropdown
                      v-model.number="newCity"
                      :options="cities"
                      optionLabel="name"
                      optionValue="id"
                      placeholder="Selecciona una ciudad"
                      class="form-input"
                      :disabled="!newCountry"
                  />
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

<script>
import { ProfileApiService } from "../service/profile-api.service.js";

const profileApiService = new ProfileApiService();

export default {
  data() {
    return {
      newFirstName: '',
      newLastName: '',
      newEmail: '',
      newCountry: null,
      newCity: null,
      countries: [
        { id: 1, name: 'Chile' },
        { id: 2, name: 'Colombia' },
        { id: 3, name: 'Ecuador' },
        { id: 4, name: 'Perú' },
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
    updateCities(countryId) {
      this.cities = this.allCities.filter(city => city.countryId === countryId);
      this.newCity = null;
    },
    confirmApply() {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        alert('No se pudo obtener el ID del usuario. Por favor, inicia sesión nuevamente.');
        return;
      }

      if (!this.newFirstName || !this.newLastName || !this.newEmail || !this.newCountry || !this.newCity) {
        alert('Por favor complete todos los campos obligatorios.');
        return;
      }

      const selectedCity = this.allCities.find(c => c.id === this.newCity);
      if (!selectedCity || selectedCity.countryId !== this.newCountry) {
        alert('La ciudad seleccionada no pertenece al país seleccionado.');
        return;
      }

      const profileData = {
        firstName: this.newFirstName.trim(),
        lastName: this.newLastName.trim(),
        email: this.newEmail.trim(),

        // Enviamos estos "confundidos a propósito":
        subscriptionId: this.newCountry,  // El backend lo interpretará como countryId
        countryId: this.newCity,          // El backend lo interpretará como cityId
        cityId: 10,                       // El backend lo interpretará como subscriptionId (fijo)

        userId: parseInt(userId, 10)
      };

      /*
      * const profileData = {
  firstName: this.newFirstName.trim(),
  lastName: this.newLastName.trim(),
  email: this.newEmail.trim(),
  cityId: this.newCity,
  subscriptionId: 10,
  countryId: this.newCountry,
  userId: parseInt(userId, 10)
};
*/

      console.log('Enviando al backend:', JSON.stringify(profileData, null, 2));

      // Aquí usas tu método .create()
      profileApiService.create(profileData)
          .then(response => {
            this.$router.push('/membership-selector');
          })
          .catch(error => {
            console.error('Error al crear el perfil:', error.response?.data || error.message);
            alert('Error al crear el perfil. Verifica la consola para más detalles.');
          });
    }

  }
};
</script>

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
