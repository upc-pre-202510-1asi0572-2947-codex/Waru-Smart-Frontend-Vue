<template>
  <div class="membership-selector">
    <h1>Select your subscription</h1>
    <div class="memberships">
      <pv-card
          v-for="(membership, index) in memberships"
          :key="membership.id"
          class="membership-option"
          @click="selectMembership(membership)"
          :style="{ backgroundColor: colors[index % colors.length], color: '#fff' }"
      >
        <template #title>
          <h2>{{ membership.name }}</h2>
          <p v-if="profileSubscriptionId === membership.id" style="font-style: italic; color: white; background-color: gray; padding: 5px; border-radius: 5px;">
            Current plan
          </p>
        </template>
        <template #content>
          <p v-html="membership.description.replace(/\n/g, '<br>')"></p>
          <p><strong>$ {{ membership.price }}</strong></p>
        </template>
      </pv-card>
    </div>

    <div class="selected-details" v-if="selectedMembership.id !== 0 && selectedMembership.id !== profileSubscriptionId">
      <h2>Subscription selected</h2>
      <p><strong>{{ selectedMembership.name }}</strong></p>
      <p>{{ selectedMembership.description }}</p>
      <p><strong>${{ selectedMembership.price }}</strong></p>
      <button class="confirm-button" @click="confirmSelection">Confirm</button>
    </div>
  </div>
</template>

<script>
import profileApiService from '../service/profile-api.service.js'; // Ajusta la ruta según tu estructura

export default {
  data() {
    return {
      profileSubscriptionId: null, // Aquí se almacenará el subscriptionId del usuario
      memberships: [
        {
          id: 1,
          name: 'Basic Package',
          description: 'Includes:\n• 1 Soil Sensor\n• 1 Smart Valve\n• Mobile App Access\n• 1-Year Support',
          price: '149'
        },
        {
          id: 2,
          name: 'Standard Package',
          description: 'Includes:\n• 3 Soil Sensors\n• 2 Smart Valves\n• Web & Mobile Access\n• 2-Year Support',
          price: '399'
        },
        {
          id: 3,
          name: 'Premium Package',
          description: 'Includes:\n• 6 Sensors (Soil, Temp, Humidity)\n• 4 Smart Controllers + Gateway\n• Full Dashboard Integration\n• 3-Year Remote Support',
          price: '599'
        }
      ],
      selectedMembership: { id: 0, name: '', description: '', price: '' },
      colors: ["#005F40", "#9D7C58", "#9A5D4E"]
    };
  },

  mounted() {
    const userId = localStorage.getItem('userId');
    profileApiService.getUserProfileById(userId).then(response => {
      this.profileSubscriptionId = response.data.subscriptionId; // Guarda el subscriptionId del usuario
    }).catch(error => {
      console.error('Error al obtener el perfil:', error);
    });
  },

  methods: {
    selectMembership(membership) {
      if (membership.id === this.profileSubscriptionId) {
        alert('Este ya es tu plan actual. Por favor, selecciona un plan diferente.');
        return;
      }
      this.selectedMembership = Object.assign({}, membership); // Copia el objeto de membresía
    },
    confirmSelection() {
      const userId = localStorage.getItem('userId'); // Obtiene el userId del almacenamiento local

      if (!userId) {
        alert('No se encontró el ID del usuario. Por favor, inicia sesión primero.');
        this.$router.push('/login');
        return;
      }

      if (this.selectedMembership.id === 0) {
        alert('Por favor, selecciona una membresía antes de confirmar.');
        return;
      }

      // Obtiene el perfil asociado al userId
      profileApiService.getUserProfileById(userId).then(response => {
        const profile = response.data;

        if (!profile || !profile.id) {
          alert('No se pudo obtener el perfil del usuario.');
          return;
        }

        // Verifica que el campo emailAddress exista y sea válido
        if (!profile.email || profile.email.trim() === '') {
          alert('El correo electrónico no es válido.');
          return;
        }

        // Construye el objeto con los datos actuales y actualiza solo el subscriptionId
        const updatedProfile = {
          fullName: profile.fullName.trim(), // Limpia espacios en blanco
          emailAddress: profile.email, // Asegura que el email sea válido
          countryId: profile.countryId,
          cityId: profile.cityId,
          subscriptionId: this.selectedMembership.id, // Actualiza solo el subscriptionId
          userId: profile.userId
        };

        console.log('Datos enviados al backend:', updatedProfile); // Depuración

        profileApiService.updateProfile(profile.id, updatedProfile).then(() => {
          alert('¡Suscripción realizada con éxito!');
          this.$router.push('/control-panel');
        }).catch(error => {
          console.error('Error al actualizar la suscripción:', error.response?.data || error.message);
          alert('Error al actualizar la suscripción.');
        });
      }).catch(error => {
        console.error('Error al obtener el perfil:', error.response?.data || error.message);
        alert('Error al obtener el perfil.');
      });
    }
  }
};
</script>

<style scoped>
.membership-selector {
  text-align: center;
}

.memberships {
  display: flex;
  justify-content: center;
  gap: 50px;
}

.membership-option {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 20px;
  width: 250px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.membership-option.selected {
  background-color: #f0f0f0;
  border-color: #000;
}

.membership-option:hover {
  background-color: #f9f9f9;
}

.selected-details {
  color: black;
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 10px;
}

.confirm-button {
  background-color: var(--primary-main-green);
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}

.confirm-button:hover {
  background-color: #004D33;
}
</style>