<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRestaurantStore } from '@/stores/RestaurantStore.js'
import type { IRestaurant } from '../shared/interfaces/RestaurantInterface.ts'
import StarRating from '@/components/StarRating.vue'
import { useReservationStore } from '@/stores/ReservationStore'

const reservationStore = useReservationStore()
const route = useRoute()
const store = useRestaurantStore()
const restaurant = ref<IRestaurant | null>(null)
const selectedDate = ref<Date | null>(null)
const selectedTime = ref<string | null>(null)
const numberOfGuests = ref<number>(1)
const currentStep = ref(0) // Étape actuelle (0: date, 1: heure, 2: invités)
// Simuler des horaires disponibles
const breakfastTimes = ref(['08:00', '08:30', '09:00', '09:30', '10:00'])
const lunchTimes = ref([
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00'
])
const dinnerTimes = ref([
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
  '22:00',
  '22:30'
])
const stepMessages = ref(['Date', 'Heur', 'Invités'])

// Liste des étapes
const steps = ref(['Date', 'Heure', 'Invités'])

onMounted(async () => {
  const restaurantId = route.params.id as string
  await store.fetchRestaurantById(restaurantId)
  restaurant.value = store.restaurants.find((r) => r._id === restaurantId) || null

  console.log('Restaurant:', restaurant.value)
})

// Méthodes pour gérer les étapes de la réservation
const onDateSelected = (date: any) => {
  console.log(date)
  selectedDate.value = new Date(date.id)
  stepMessages.value[0] = `${formatDate(selectedDate.value)}`
  currentStep.value = 1 // Passer à l'étape de sélection de l'heure
}

const onTimeSelected = (time: string) => {
  console.log('Heure sélectionnée :', time)
  selectedTime.value = time
  stepMessages.value[1] = ` ${selectedTime.value}`
  currentStep.value = 2 // Passer à l'étape de sélection des invités
}
const goToStep = (stepIndex: number) => {
  // Vérifiez que l'utilisateur ne peut pas passer à l'étape suivante
  if (stepIndex > currentStep.value) {
    // Vérifiez la validité de l'étape actuelle avant de permettre de passer à la suivante
    if (currentStep.value === 0 && !selectedDate.value) {
      console.error('Veuillez sélectionner une date avant de continuer.')
      return // Empêche de passer à l'étape suivante
    }
    if (currentStep.value === 1 && !selectedTime.value) {
      console.error('Veuillez sélectionner une heure avant de continuer.')
      return // Empêche de passer à l'étape suivante
    }
    if (currentStep.value === 2 && numberOfGuests.value < 1) {
      console.error("Veuillez spécifier le nombre d'invités.")
      return // Empêche de passer à l'étape suivante
    }
  }
  currentStep.value = stepIndex // Met à jour l'étape actuelle uniquement si les vérifications passent
}

const confirmReservation = async () => {
  if (
    selectedDate.value instanceof Date &&
    !isNaN(selectedDate.value.getTime()) &&
    selectedTime.value &&
    restaurant.value?._id
  ) {
    const reservationData = {
      tableId: 1,
      numberOfPersons: numberOfGuests.value,
      reservationDate: selectedDate.value.toISOString(),
      restaurant: restaurant.value._id
    }

    console.log(`Tentative de réservation :`, reservationData)

    try {
      await reservationStore.createReservation(reservationData)
      stepMessages.value[2] = ` ${numberOfGuests.value}`
      currentStep.value = 3 // Passer à l'étape de confirmation
      console.log('Réservation confirmée avec succès !')
    } catch (error) {
      console.error('Erreur lors de la confirmation de la réservation :', error)
    }
  } else {
    console.error("La date, l'heure ou l'ID du restaurant sélectionné est invalide.", {
      dateValid: selectedDate.value instanceof Date && !isNaN(selectedDate.value.getTime()),
      timeValid: selectedTime.value !== null,
      restaurantIdValid: restaurant.value?._id !== undefined
    })
  }
}

// Formater la date pour l'affichage
const formatDate = (date: Date | null) => {
  if (!date) return ''
  return date.toLocaleDateString('fr-FR', {
    month: 'long',
    day: 'numeric'
  })
}
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

        <!-- Progression des étapes avec icônes -->
        <div class="reservation-steps">
          <ul>
            <li
              v-for="(step, index) in stepMessages"
              :key="index"
              :class="{ active: currentStep >= index, disabled: currentStep < index }"
              @click="goToStep(index)"
            >
              <span>{{ step }}</span>
              <!-- Affiche le texte de l'étape -->
              <span v-if="index < stepMessages.length - 1" class="arrow"> &gt; </span>
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

          <div>
            <h4>Petit déjeuner :</h4>
            <div class="time-buttons">
              <button v-for="time in breakfastTimes" :key="time" @click="onTimeSelected(time)">
                {{ time }}
              </button>
            </div>
          </div>

          <div>
            <h4>Déjeuner :</h4>
            <div class="time-buttons">
              <button v-for="time in lunchTimes" :key="time" @click="onTimeSelected(time)">
                {{ time }}
              </button>
            </div>
          </div>

          <div>
            <h4>Dîner :</h4>
            <div class="time-buttons">
              <button v-for="time in dinnerTimes" :key="time" @click="onTimeSelected(time)">
                {{ time }}
              </button>
            </div>
          </div>
        </div>

        <!-- Step 3: Guest Picker -->
        <div v-if="currentStep === 2" class="guest-picker">
          <h3>Nombre d'invités :</h3>
          <input type="number" v-model="numberOfGuests" min="1" />
          <button @click="confirmReservation">Confirmer la réservation</button>
        </div>

        <!-- Confirmation Message -->
        <div v-if="currentStep === 3">
          <p>
            Réservation confirmée pour {{ numberOfGuests }} invités à {{ selectedTime }} le
            {{ formatDate(selectedDate) }}
          </p>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Chargement des détails du restaurant...</p>
    </div>
  </div>
</template>

<style scoped>
/* Style pour la section de sélection du nombre d'invités */
.guest-picker {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ccc; /* Bordure légère autour de la section */
  border-radius: 8px; /* Coins arrondis */
  background-color: #f9f9f9; /* Couleur de fond douce */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Ombre légère */
}

/* Style pour le titre */
.guest-picker h3 {
  margin-bottom: 10px; /* Espacement en bas */
  font-size: 1.5rem; /* Taille de police */
  color: #333; /* Couleur du texte */
}

/* Style pour l'input */
.guest-picker input[type='number'] {
  width: 60%; /* Remplir toute la largeur */
  padding: 10px; /* Espacement à l'intérieur */
  border: 1px solid #ccc; /* Bordure légère */
  border-radius: 4px; /* Coins arrondis */
  font-size: 1rem; /* Taille de police */
  transition: border-color 0.3s; /* Transition pour la couleur de la bordure */
}

/* Changement de couleur de la bordure au focus */
.guest-picker input[type='number']:focus {
  border-color: #000000; /* Bordure bleue au focus */
  outline: none; /* Enlève l'outline par défaut */
}

/* Style pour le bouton */
.guest-picker button {
  margin-top: 30px; /* Espacement en haut */
  padding: 10px 20px; /* Espacement intérieur */
  border: none; /* Enlève la bordure par défaut */
  border-radius: 5px; /* Coins arrondis */
  background-color:#00bcd4; /* Couleur de fond bleue */
  color: white; /* Couleur du texte */
  font-size: 1rem; /* Taille de police */
  cursor: pointer; /* Curseur en main */
  transition: background-color 0.3s; /* Transition pour la couleur de fond */
}

/* Changement de couleur de fond au hover */
.guest-picker button:hover {
  background-color: #77d2de; /* Couleur plus foncée au hover */
}

/* Changement de couleur de fond au focus */
.guest-picker button:focus {
  outline: none; /* Enlève l'outline par défaut */
}

.disabled {
  cursor: not-allowed;
  color: grey; /* Changez la couleur pour indiquer que l'étape est désactivée */
  pointer-events: none; /* Désactive les événements de clic */
}

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
  width: 300px;
  height: 800px;
  padding: 20px;
  margin-right: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
input[type='number'] {
  width: 50px;
  margin-left: 10px;
}
.reservation-steps ul {
  list-style: none; /* Enlève les puces */
  padding: 0;
}

.reservation-steps li {
  display: flex;
  align-items: center;
  cursor: pointer; /* Change le curseur pour indiquer que l'élément est cliquable */
}

.reservation-steps li.active {
  font-weight: bold; /* Mettez l'étape active en gras */
}

.step-icon {
  margin-right: 5px; /* Espace entre l'icône et le texte */
}

/* Styles pour le déroulement de la réservation */
.reservation-steps {
  margin-bottom: 20px;
  border-radius: 10px;
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

  background-color: #e0e0e0; /* Couleur de fond par défaut */
  transition: 0.3s; /* Transition pour un changement de couleur fluide */
}
.reservation-steps li.active {
  background-color: #00bcd4; /* Couleur pour l'étape active */
  color: white; /* Texte en blanc pour l'étape active */
  transition: 0.4s;
}
.arrow {
  margin: 0 10px; /* Espace autour de la flèche */
}

.time-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* Espace entre les boutons */
}

.time-buttons button {
  padding: 10px 15px;
  background-color: #00bcd4; /* Couleur de fond */
  color: white; /* Couleur du texte */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s; /* Effet de transition */
}

.time-buttons button:hover {
  background-color: #0097a7; /* Couleur au survol */
}
</style>
