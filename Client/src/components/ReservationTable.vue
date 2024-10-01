<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
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
const currentStep = ref(0); // Étape actuelle (0: date, 1: heure, 2: invités)

// Liste des étapes
const steps = ref(['Date', 'Heure', 'Invités']);

onMounted(async () => {
  const restaurantId = route.params.id as string;
  await store.fetchRestaurantById(restaurantId);
  restaurant.value = store.restaurants.find(r => r._id === restaurantId) || null;

  console.log('Restaurant:', restaurant.value);
});

// Méthodes pour gérer les étapes de la réservation
const onDateSelected = (date: any) => {
  console.log('Date sélectionnée :', date);
  selectedDate.value = new Date(date.id);
  currentStep.value = 1; // Passer à l'étape de sélection de l'heure
};

const onTimeSelected = () => {
  console.log('Heure sélectionnée :', selectedTime.value);
  currentStep.value = 2; // Passer à l'étape de sélection des invités
};

const confirmReservation = async () => {
  if (selectedDate.value instanceof Date && !isNaN(selectedDate.value.getTime()) && selectedTime.value && restaurant.value?._id) {
    const reservationData = {
      tableId: 1,
      numberOfPersons: numberOfGuests.value,
      reservationDate: selectedDate.value.toISOString(),
      restaurant: restaurant.value._id,
    };

    console.log(`Tentative de réservation :`, reservationData);

    try {
      await reservationStore.createReservation(reservationData);
      currentStep.value = 3; // Passer à l'étape de confirmation
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
}

// Simuler des heures disponibles
const availableTimes = ref(['12:00', '12:30', '13:00', '19:00', '19:30', '20:00']);

// Formater la date pour l'affichage
const formatDate = (date: Date | null) => {
  if (!date) return '';
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>

<template>
  <div>
    <div v-if="restaurant" class="restaurant-container">
      <!-- Left Side: Restaurant Details -->
      <div class="restaurant-header">
        <img :src="restaurant.RestoPhoto" alt="Photo du restaurant" class="restaurant-image" />
        <div class="restaurant-info">
          <h1>{{ restaurant.name }}</h1>
          <p>Adresse : {{ restaurant.address }}</p>

          <div class="cuisine-rating">
            <p>Type de cuisine : {{ restaurant.cuisineType }}</p>
            <StarRating :rating="restaurant.globalRatingResaurant" />
          </div>
          <div class="description-restaurant"><p>Description du restaurant</p></div>
        </div>
      </div>

      <!-- Right Side: Reservation Form -->
      <div class="reservation">
        <h2>Réserver une table</h2>

        <!-- Step Progression -->
        <div class="reservation-steps">
          <ul>
            <li v-for="(step, index) in steps" :key="index" :class="{ active: currentStep >= index }">
              {{ step }}
              <span v-if="index < steps.length - 1" class="arrow"> &gt; </span>
            </li>
          </ul>
        </div>

        <!-- Step 1: Date Selector -->
        <div v-if="currentStep === 0">
          <VCalendar @dayclick="onDateSelected" />
        </div>

        <!-- Step 2: Time Selector -->
        <div v-if="currentStep === 1">
          <h3>Choisissez l'heure :</h3>
          <select v-model="selectedTime" @change="onTimeSelected">
            <option v-for="time in availableTimes" :key="time" :value="time">
              {{ time }}
            </option>
          </select>
        </div>

        <!-- Step 3: Guest Picker -->
        <div v-if="currentStep === 2">
          <h3>Nombre d'invités :</h3>
          <input type="number" v-model="numberOfGuests" min="1" />
          <button @click="confirmReservation">Confirmer la réservation</button>
        </div>

        <!-- Confirmation Message -->
        <div v-if="currentStep === 3">
          <p>Réservation confirmée pour {{ numberOfGuests }} invités à {{ selectedTime }} le {{ formatDate(selectedDate) }}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Chargement des détails du restaurant...</p>
    </div>
  </div>
</template>

<style scoped>
.restaurant-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.restaurant-header {
  display: flex;
  flex: 1;
}
.description-restaurant {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 10px;
  background-color: #f9f9f9;
}
.restaurant-image {
  width: 350px;
  height: auto;
  border-radius: 8px;
  margin-right: 20px;
}
.restaurant-info > h1 {
  font-size: 3rem;
}
.restaurant-info {
  font-size: 1.5rem;
}
.cuisine-rating {
  display: flex;
  align-items: center;
}
.cuisine-rating p {
  margin-right: 100px;
}
.reservation {
  background-color: #f9f9f9;
  width:280px;
  padding: 20px;
  margin-right: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
input[type="number"] {
  width: 50px;
  margin-left: 10px;
}

/* Styles pour le déroulement de la réservation */
.reservation-steps {
  margin-bottom: 20px;
}
.reservation-steps ul {
  list-style: none;
  padding: 0;
  display: flex; /* Utiliser flex pour aligner horizontalement les étapes */
}
.reservation-steps li {
  flex: 1; 
  text-align: center;
  padding: 10px;
  border-radius: 5px;
  background-color: #e0e0e0; /* Couleur de fond par défaut */
  transition: background-color 0.3s; /* Transition pour un changement de couleur fluide */
}
.reservation-steps li.active {
  background-color:  #00bcd4; /* Couleur pour l'étape active */
  color: white; /* Texte en blanc pour l'étape active */
}
.arrow {
  margin: 0 10px; /* Espace autour de la flèche */
}
</style>
