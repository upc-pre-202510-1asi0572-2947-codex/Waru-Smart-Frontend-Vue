<script>
import { ProfileApiService } from "../service/profile-api.service.js";
import { Profile } from "../model/profile.entity.js";

const profileApiService = new ProfileApiService();

export default {
  data() {
    return {
      memberships: [
        { id: 1, name: 'Basic Package' },
        { id: 2, name: 'Standard Package' },
        { id: 3, name: 'Premium Package' }
      ],
      currentPlanName: '',
      newName: '',
      newEmail: '',
      newCountry: null,
      newCity: null,
      newSubscription: '',
      isEditable: false,
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
  mounted() {
    const userId = localStorage.getItem('userId');
    profileApiService.getUserProfileById(userId).then(response => {
      const prof = response.data;
      this.profileId = prof.id; // Guarda el profileId
      this.newName = prof.fullName;
      this.newEmail = prof.email;
      this.newCountry = prof.countryId;
      this.newCity = prof.cityId;
      this.newSubscription = prof.subscriptionId;
      this.updateCities(this.newCountry);
      const currentPlan = this.memberships.find(plan => plan.id === this.newSubscription);
      this.currentPlanName = currentPlan ? currentPlan.name : 'Unknown Plan';
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
    enableEdit() {
      this.isEditable = true;
    },
    confirmApply() {
      const profileData = {
        fullName: this.newName,
        emailAddress: this.newEmail,
        countryId: this.newCountry,
        cityId: this.newCity,
        subscriptionId: this.newSubscription
      };

      profileApiService.updateProfile(this.profileId, profileData).then(response => {
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
    redirectToMembershipSelector() {
      this.$router.push({ name: 'membership-selector' });
    },
    updateCities(countryId) {
      this.cities = this.allCities.filter(city => city.countryId === countryId);
    }
  }
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
          <!-- Columna de imagen y botón de editar -->
          <div class="profile-image-column">
            <img
                class="profile-avatar"
                alt="avatar"
                src="https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg"
            />
            <button class="edit-icon-button" @click="enableEdit">
              <i class="pi pi-pencil"></i> Editar perfil
            </button>
          </div>

          <!-- Columna de formulario -->
          <div class="profile-form-column">
            <!-- Nombre y Email -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">{{ $t('name') }}:</label>
                <pv-input-text v-model="newName" :disabled="!isEditable" class="form-input" />
              </div>

              <div class="form-group">
                <label class="form-label">{{ $t('email') }}:</label>
                <pv-input-text v-model="newEmail" :disabled="!isEditable" class="form-input" />
              </div>
            </div>

            <hr class="divider" />

            <!-- País, Ciudad y Plan -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">{{ $t('country') }}:</label>
                <pv-dropdown v-model="newCountry" :options="countries" optionLabel="name" optionValue="id"
                             :disabled="!isEditable" class="form-input" />
              </div>

              <div class="form-group">
                <label class="form-label">{{ $t('city') }}:</label>
                <pv-dropdown v-model="newCity" :options="cities" optionLabel="name" optionValue="id"
                             :disabled="!isEditable" class="form-input" />
              </div>

              <div class="form-group">
                <label class="form-label">{{ $t('Current plan') }}:</label>
                <div class="input-group">
                  <pv-input-text v-model="currentPlanName" :disabled="true" class="form-input" />
                  <pv-button class="change-button" @click="redirectToMembershipSelector">
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
  display: flex;
  justify-content: center;
  margin: 30px 0;
}

.profile-card {
  width: 90%;
  max-width: 1100px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.profile-header {
  padding: 20px 0;
  text-align: left;
  background-color: #ffffff;
  border-bottom: 1px solid #eee;
  padding-left: 30px;
}

.profile-title {
  font-size: 28px;
  font-weight: 700;
  color: #222;
}

.profile-content {
  display: flex;
  padding: 40px;
  gap: 50px;
}

.profile-image-column {
  flex: 0 0 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
}

.profile-avatar {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 3px solid #f0f0f0;
}

.edit-icon-button {
  margin-top: 15px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #465aed;
  font-weight: 600;
}

.edit-icon-button:hover {
  text-decoration: underline;
}

.profile-form-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.change-button {
  background-color: #ffffff;
  color: #465aed;
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  border-radius: 5px;
}

.divider {
  border: none;
  border-top: 1px solid #eee;
  margin: 10px 0;
}

.button-container {
  display: flex;
  justify-content: start;
  gap: 15px;
  margin-top: 20px;
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
    padding: 20px;
  }

  .form-row {
    flex-direction: column;
  }
}
</style>


