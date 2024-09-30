<template>
  <div>
    <NavigationBar />
    <div v-if="restaurant">
      <div class="restaurant-header">
        <img :src="restaurant.RestoPhoto" alt="Photo du restaurant" class="restaurant-image" />
        <div class="restaurant-info">
          <h1>{{ restaurant.name }}</h1>
          <p>Adresse : {{ restaurant.address }}</p>
          <p>Type de cuisine : {{ restaurant.cuisineType }}</p>
          <StarRating :rating="restaurant.globalRatingResaurant" />
        </div>
      </div>

      <div class="reservation">
        <h2>Réserver une table</h2>

        <!-- Step 1: Date Selector -->
        <div v-if="currentStep === 'date'">
          <VCalendar @dayclick="onDateSelected" />
        </div>

        <!-- Step 2: Time Selector -->
        <div v-if="currentStep === 'time'">
          <h3>Choisissez l'heure :</h3>
          <select v-model="selectedTime" @change="onTimeSelected">
            <option v-for="time in availableTimes" :key="time" :value="time">
              {{ time }}
            </option>
          </select>
        </div>

        <!-- Step 3: Guest Picker -->
        <div v-if="currentStep === 'guests'">
          <h3>Nombre d'invités :</h3>
          <input type="number" v-model="numberOfGuests" min="1" />
          <button @click="confirmReservation">Confirmer la réservation</button>
        </div>

        <!-- Confirmation Message -->
        <div v-if="currentStep === 'confirmed'">
          <p>Réservation confirmée pour {{ numberOfGuests }} invités à {{ selectedTime }} le {{ formatDate(selectedDate) }}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Chargement des détails du restaurant...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import NavigationBar from '../components/NavigationBar.vue';
import { useRestaurantStore } from '@/stores/RestaurantStore.js';
import type { IRestaurant } from '../shared/interfaces/RestaurantInterface.ts';
import StarRating from '@/components/StarRating.vue';
import { useReservationStore } from '@/stores/ReservationStore';

const reservationStore = useReservationStore();
const route = useRoute();
const store = useRestaurantStore();
const restaurant = ref<IRestaurant | null>(null);
const selectedDate = ref<Date | null>(null);
const selectedTime = ref<string | null>(null);
const numberOfGuests = ref<number>(1);
const currentStep = ref<string>('date'); // Manage current step of the reservation process

onMounted(async () => {
  const restaurantId = route.params.id as string;
  await store.fetchRestaurantById(restaurantId);
  restaurant.value = store.restaurants.find(r => r._id === restaurantId) || null;

  // Vérifiez que restaurant est bien défini
  console.log('Restaurant:', restaurant.value);
});

// Methods to handle the steps of the reservation
const onDateSelected = (date: any) => {
  console.log('Date sélectionnée :', date);
  selectedDate.value = new Date(date.id); // Convertir l'ID en objet Date
  currentStep.value = 'time'; // Passer à l'étape de sélection de l'heure
};

const onTimeSelected = () => {
  console.log('Heure sélectionnée :', selectedTime.value);
  currentStep.value = 'guests'; // Move to the guest selection step
};

const confirmReservation = async () => {
  if (selectedDate.value instanceof Date && !isNaN(selectedDate.value.getTime()) && selectedTime.value && restaurant.value?._id) {
    const reservationData = {
      tableId: 1, // Remplacez par l'ID de table approprié
      numberOfPersons: numberOfGuests.value,
      reservationDate: selectedDate.value.toISOString(), // Format ISO requis par votre API
      restaurant: restaurant.value._id, // Assurez-vous que restaurant est chargé
    };

    console.log(`Tentative de réservation :`, reservationData);

    try {
      // Appel au store pour créer la réservation
      await reservationStore.createReservation(reservationData);

      currentStep.value = 'confirmed'; // Passer à l'étape de confirmation
      console.log('Réservation confirmée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la confirmation de la réservation :', error);
    }
  } else {
    console.error('La date, l\'heure ou l\'ID du restaurant sélectionné est invalide.', {
      dateValid: selectedDate.value instanceof Date && !isNaN(selectedDate.value.getTime()),
      timeValid: selectedTime.value !== null,
      restaurantIdValid: restaurant.value?._id !== undefined,
    });
  }
};



// Simulate available times
const availableTimes = ref(['12:00', '12:30', '13:00', '19:00', '19:30', '20:00']);

// Format the date for display
const formatDate = (date: Date | null) => {
  if (!date) return '';
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>

<style>
.restaurant-header {
  display: flex;
  align-items: center;
}

.restaurant-image {
  width: 150px; /* Ajustez la taille selon vos besoins */
  height: auto;
  border-radius: 8px;
  margin-right: 20px;
}

.restaurant-info {
  flex: 1;
}

.reservation {
  margin-top: 20px;
}

input[type="number"] {
  width: 50px;
  margin-left: 10px;
}
</style>
