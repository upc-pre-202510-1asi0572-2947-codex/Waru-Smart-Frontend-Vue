<script>
import { ProfileApiService } from "../service/profile-api.service.js";
import { Profile } from "../model/profile.entity.js";


const profileApiService = new ProfileApiService();

export default {
  data() {
    return {
      memberships: [
        {id: 1, name: 'Basic'},
        {id: 2, name: 'Regular'},
        {id: 3, name: 'Premium'}
      ],
      currentPlanName: '',
      newName: '',
      boolName: true,
      newSubscription: '',
      boolSubscription: true,
      newEmail: '',
      boolEmail: true,
      newCountry: null,
      boolCountry: true,
      newCity: null,
      boolCity: true,
      countries: [
        {id: 1, name: 'Chile', cities: ['Santiago', 'Antofagasta', 'Concepción']},
        {id: 2, name: 'Colombia', cities: ['Bogotá', 'Barranquilla', 'Medellin']},
        {id: 3, name: 'Ecuador', cities: ['Guayaquil', 'Quito', 'Cuenca']},
        {id: 4, name: 'Perú', cities: ['Lima', 'Arequipa', 'Trujillo']},
      ],
      allCities: [
        {id: 1, name: 'Santiago', countryId: 1},
        {id: 2, name: 'Antofagasta', countryId: 1},
        {id: 3, name: 'Concepción', countryId: 1},
        {id: 4, name: 'Bogotá', countryId: 2},
        {id: 5, name: 'Barranquilla', countryId: 2},
        {id: 6, name: 'Medellin', countryId: 2},
        {id: 7, name: 'Guayaquil', countryId: 3},
        {id: 8, name: 'Quito', countryId: 3},
        {id: 9, name: 'Cuenca', countryId: 3},
        {id: 10, name: 'Lima', countryId: 4},
        {id: 11, name: 'Arequipa', countryId: 4},
        {id: 12, name: 'Trujillo', countryId: 4},
      ],
      cities: []
    };
  },
  mounted() {
    const userId = localStorage.getItem('userId');
    profileApiService.getUserProfileById(userId).then(response => {
      const prof = response.data;
      this.newName = prof.fullName;
      this.newEmail = prof.email;
      this.newCountry = prof.countryId;
      this.newCity = prof.cityId;
      this.newSubscription = prof.subscriptionId;
      this.updateCities(this.newCountry);
      const currentPlan = this.memberships.find(plan => plan.id === this.newSubscription);
      this.currentPlanName = currentPlan ? currentPlan.name : 'Unknown Plan';// Actualiza las ciudades cuando se carga el perfil
    }).catch(error => {
      console.error('Error obteniendo el perfil del usuario:', error);
    });
  },
  watch: {
    newCountry(newVal) {
      this.updateCities(newVal);
    }
  },
  methods: {
    changeSubscription() {
      this.boolSubscription = false;
    },
    saveSubscriptionChange(newSubscription) {
      const currentPlan = this.memberships.find(plan => plan.id === newSubscription);
      this.currentPlanName = currentPlan ? currentPlan.name : 'Unknown Plan';
      this.boolSubscription = true;
    },
    saveNameChange(newName) {
      this.boolName = true;
    },
    changeName() {
      this.boolName = false;
    },
    saveEmailChange(newEmail) {
      const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
      if (emailRegex.test(newEmail)) {
        this.boolEmail = true;
      } else {
        alert('Por favor, ingresa una dirección de correo válida');
      }
    },
    changeEmail() {
      this.boolEmail = false;
    },
    saveCountryChange(newCountry) {
      this.boolCountry = true;
    },
    changeCountry() {
      this.boolCountry = false;
    },
    saveCityChange(newCity) {
      this.boolCity = true;
    },
    changeCity() {
      this.boolCity = false;
    },
    savePasswordChange(newPassword) {
      this.boolPassword = true;
    },
    changePassword() {
      this.boolPassword = false;
    },
    confirmApply() {
      const profile = new Profile(localStorage.getItem('userId'), this.newName, this.newEmail, this.newCountry, this.newSubscription, this.newCity);

      console.log(profile);

      profileApiService.update(profile.id, profile).then(response => {
        console.log(response);
        this.$router.push('/control-panel');
        alert('¡Actualización exitosa!');
      }).catch(error => {
        console.error('Error actualizando el perfil:', error);
        alert('Error al actualizar.');
      });
    },
    signOut() {
      this.$router.push('/sign-in');
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
          <h1 class="profile-title">{{ $t('myProfile') }}</h1>
        </div>
      </template>
      <template #content>
        <div class="profile-content">
          <!-- Columna de la imagen -->
          <div class="profile-image-column">
            <img class="profile-avatar" alt="avatar"
                 src="https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg">
          </div>

          <!-- Columna de los formularios -->
          <div class="profile-form-column">
            <!-- Fila de Nombre y Email -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">{{ $t('name') }}:</label>
                <div class="input-group">
                  <pv-input-text v-model="newName" :disabled="boolName" class="form-input"/>
                  <pv-button v-if="!boolName" class="check-button" @click="saveNameChange(newName)">{{
                      $t('check')
                    }}
                  </pv-button>
                  <pv-button v-else class="change-button" @click="changeName()">{{ $t('change') }}</pv-button>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">{{ $t('email') }}:</label>
                <div class="input-group">
                  <pv-input-text v-model="newEmail" :disabled="boolEmail" class="form-input"/>
                  <pv-button v-if="!boolEmail" class="check-button" @click="saveEmailChange(newEmail)">{{
                      $t('check')
                    }}
                  </pv-button>
                  <pv-button v-else class="change-button" @click="changeEmail()">{{ $t('change') }}</pv-button>
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
                  <pv-dropdown v-model="newCountry" :options="countries" optionLabel="name" optionValue="id"
                               :disabled="boolCountry" class="form-input"/>
                  <pv-button v-if="!boolCountry" class="check-button" @click="saveCountryChange(newCountry)">
                    {{ $t('check') }}
                  </pv-button>
                  <pv-button v-else class="change-button" @click="changeCountry()">{{ $t('change') }}</pv-button>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">{{ $t('city') }}:</label>
                <div class="input-group">
                  <pv-dropdown v-model="newCity" :options="cities" optionLabel="name" optionValue="id"
                               :disabled="boolCity" class="form-input"/>
                  <pv-button v-if="!boolCity" class="check-button" @click="saveCityChange(newCity)">{{
                      $t('check')
                    }}
                  </pv-button>
                  <pv-button v-else class="change-button" @click="changeCity()">{{ $t('change') }}</pv-button>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">{{ $t('Current plan') }}:</label>
                <div class="input-group">
                  <pv-input-text
                      v-model="currentPlanName"
                      :disabled="true"
                      class="form-input"
                  />
                  <pv-button v-if="!boolSubscription" class="check-button"
                             @click="saveSubscriptionChange(newSubscription)">
                    {{ $t('check') }}
                  </pv-button>
                  <pv-button v-else class="change-button" @click="changeSubscription()">
                    {{ $t('change') }}
                  </pv-button>
                </div>
              </div>

            </div>

            <!-- Botones de acción -->
            <div class="button-container">
              <pv-button class="apply-button" @click="confirmApply">{{ $t('apply') }}</pv-button>
              <pv-button class="signout-button" @click="signOut()">{{ $t('signOut') }}</pv-button>
            </div>
          </div>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>
.profile-wrapper {
  width: 1000%;
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
  gap: 8px;
}

.form-input {
  flex: 1;
  min-width: 0;
}

.check-button {
  background-color: #005f40;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
}

.change-button {
  background-color: #ffffff;
  color: #465aed;
  border: 1px solid #ddd;
  padding: 0.5rem;
  border-radius: 4px;
}

.divider {
  border: none;
  border-top: 1px solid #eee;
  margin: 0;
}

.button-container {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.apply-button {
  background-color: #005f40;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 4px;
}

.signout-button {
  background-color: #FF3439;
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