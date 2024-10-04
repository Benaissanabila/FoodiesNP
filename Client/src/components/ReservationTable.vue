<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRestaurantStore } from '@/stores/RestaurantStore'
import type { IRestaurant } from '../shared/interfaces/RestaurantInterface'
import StarRating from '@/components/StarRating.vue'
import { useReservationStore } from '@/stores/ReservationStore'
import confetti from 'canvas-confetti';
import type { IUser } from '@/shared/interfaces/UserInterface'
import { useUserStore } from '@/stores/UserStore'

const reservationStore = useReservationStore()
const route = useRoute()
const store = useRestaurantStore()
const restaurant = ref<IRestaurant | null>(null)
const user = ref<IUser | null>(null)
const userStore = useUserStore()
const selectedDate = ref<Date | null>(null)
const selectedTime = ref<string | null>(null)
const numberOfGuests = ref<number>(1)
const currentStep = ref(0) // Étape actuelle (0: date, 1: heure, 2: invités)
const launchConfetti = () => {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
}
// Horaires disponibles
const breakfastTimes = ref(['08:00', '08:30', '09:00', '09:30', '10:00'])
const lunchTimes = ref([
  '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00'
])
const dinnerTimes = ref([
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00', '22:30'
])

const stepMessages = ref(['Date', 'Heure', 'Invité(s)'])

onMounted(async () => {
  const restaurantId = route.params.id as string;

  // Récupérer les données du restaurant
  await store.fetchRestaurantById(restaurantId);
  restaurant.value = store.restaurants.find((r) => r._id === restaurantId) || null;

  // Récupérer les données de l'utilisateur
  userStore.checkAuth(); // Appel de la méthode checkAuth
  user.value = userStore.user; // Assurez-vous de récupérer l'utilisateur depuis le store

  // Vérifiez si le restaurant et l'utilisateur existent avant d'accéder aux propriétés
  if (!restaurant.value) {
    console.error("Aucun restaurant trouvé avec cet ID.");
  }

  if (!user.value) {
    console.warn("Aucun utilisateur trouvé.");
  } else {
    console.log("Utilisateur trouvé :", user.value);
  }
});


// Méthode pour sélectionner la date
// Méthode pour sélectionner la date
const onDateSelected = (dateObject: any) => {
  // Vérifier que l'objet contient une date valide
  const parsedDate = new Date(dateObject.date)

  if (!isNaN(parsedDate.getTime())) { // Si la date est valide
    selectedDate.value = parsedDate
    stepMessages.value[0] = formatDate(selectedDate.value)
    console.log('Date sélectionnée:', formatDate(selectedDate.value))
    currentStep.value = 1 // Passer à l'étape de sélection de l'heure
  } else {
    console.error('Date sélectionnée invalide:', dateObject)
  }
}


// Méthode pour sélectionner l'heure
const onTimeSelected = (time: string) => {
  selectedTime.value = time
  stepMessages.value[1] = `${selectedTime.value}`
  console.log('Heure sélectionnée:', time)
  currentStep.value = 2 // Passer à l'étape de sélection des invités
}

// Méthode pour passer à une autre étape
const goToStep = (stepIndex: number) => {
  // Vérifier que les étapes sont respectées
  if (stepIndex > currentStep.value) {
    if (currentStep.value === 0 && !selectedDate.value) {
      return; // Aucune action à faire si la date n'est pas sélectionnée
    }
    if (currentStep.value === 1 && !selectedTime.value) {
      return; // Aucune action à faire si l'heure n'est pas sélectionnée
    }
    if (currentStep.value === 2 && numberOfGuests.value < 1) {
      return; // Aucune action à faire si le nombre d'invités est inférieur à 1
    }
  }
  currentStep.value = stepIndex;
};


// Confirmation de la réservation
// Confirmation de la réservation
const confirmReservation = async () => {
  if (
    selectedDate.value instanceof Date &&
    !isNaN(selectedDate.value.getTime()) &&
    selectedTime.value &&
    restaurant.value?._id &&
    user.value?._id
  ) {
    const reservationDate = new Date(`${selectedDate.value.toDateString()} ${selectedTime.value}`).toISOString();
    const reservationData = {
      tableId: Math.floor(Math.random() * 10) + 1, // ID de table généré aléatoirement
      numberOfPersons: numberOfGuests.value,
      reservationDate,
      restaurant: restaurant.value._id,
      user: user.value._id, // ID de l'utilisateur
    };

    console.log('Tentative de réservation:', reservationData);

    try {
      // Appel à l'API pour créer la réservation
      const response = await reservationStore.createReservation(reservationData);
      
      // Vérifier si la réservation a été créée avec succès
      if (response) {
        stepMessages.value[2] = `${numberOfGuests.value} invités`;
        currentStep.value = 3;
        console.log('Réservation confirmée avec succès !');
        
        // Lancer les confettis après confirmation
        launchConfetti();
      }
    } catch (error) {
      console.error('Erreur lors de la confirmation de la réservation :', error);
    }
  } else {
    console.error("Les informations de la réservation sont invalides.", {
      dateValid: selectedDate.value instanceof Date && !isNaN(selectedDate.value.getTime()),
      timeValid: selectedTime.value !== null,
      restaurantIdValid: restaurant.value?._id !== undefined,
      userIdValid: user.value?._id !== undefined,
    });
  }
};


// Fonction pour formater la date
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
        <div v-if="currentStep === 3" class="confirmation" ref="confettiContainer">
          <p class="confirmation-message">
  Félicitations ! Réservation confirmée pour {{ numberOfGuests }} invités à {{ selectedTime }} le
  {{ formatDate(selectedDate) }} à <span class="restaurant-name">{{ restaurant.name }}</span>
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
  width: 320px;
  height: 630px;
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
 
}

.reservation-steps li {
  display: flex;
  align-items: center;
  cursor: pointer; /* Change le curseur pour indiquer que l'élément est cliquable */
}

.reservation-steps li.active {
  font-weight: bold; /* Mettez l'étape active en gras */
}

/* Styles pour le déroulement de la réservation */
.reservation-steps {
  margin-bottom: 50px;
  border-radius: 10px;
}
.reservation-steps ul {
  list-style: none;
  padding: 0px;
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
.reservation-steps li:first-child{
  border-radius: 15px 0 0 15px;
}
.reservation-steps li:last-child{
  border-radius: 0 15px 15px 0;
}
.arrow {
  margin-left: 25px;
}

.time-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* Espace entre les boutons */
}

.time-buttons button {
  padding: 10px 10px;
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

.confirmation {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.confirmation-message {
  font-size: 20px;
  color: #00bcd4;
  font-weight: bold;
  animation: flash 1s ease-in-out;
}

@keyframes flash {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.restaurant-name {
  color: #000000; /* Remplace par la couleur souhaitée */
  font-weight: bold;

}
</style>
