<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useReservationStore } from '@/stores/ReservationStore';
import { useUserStore } from '@/stores/UserStore';
import { useRestaurantStore } from '@/stores/RestaurantStore';
import type { IReservation } from '@/shared/interfaces/ReservationInterface';
import { useRouter } from 'vue-router'; 
import { useCommentStore } from '@/stores/CommentStore';
import NavigationBar from '@/components/NavigationBar.vue';
import Footer from '@/components/Footer.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const reservationStore = useReservationStore();
const userStore = useUserStore();
const restaurantStore = useRestaurantStore();
const commentStore = useCommentStore();
const router = useRouter();

const userId = ref<string | null>(null);
const editingReservation = ref<IReservation | null>(null);
const editedReservationDate = ref<string | null>(null);
const editedReservationTime = ref<string | null>(null);

// Pagination variables
const currentPage = ref(1);
const itemsPerPage = ref(6); // Number of reservations per page
const totalPages = ref(0);

// Function to update total pages
const updatePagination = () => {
  totalPages.value = Math.ceil(reservationStore.reservations.length / itemsPerPage.value);
};

onMounted(async () => {
  userStore.checkAuth();
  if (userStore.user && userStore.user._id) {
    userId.value = userStore.user._id;
    await reservationStore.fetchUserReservations(userId.value);
    
    // Tri des réservations par date (de la plus lointaine à la plus proche)
    reservationStore.reservations.sort((a, b) => new Date(b.reservationDate).getTime() - new Date(a.reservationDate).getTime());

    // Récupérer les commentaires après avoir chargé les réservations
    await commentStore.loadComments();

    const restaurantIds = reservationStore.reservations.map(reservation => reservation.restaurant);
    await Promise.all(restaurantIds.map(id => restaurantStore.fetchRestaurantById(id)));
    
    // Update pagination after fetching reservations
    updatePagination();
  }
});

// Function to get current page reservations
const currentReservations = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  return reservationStore.reservations.slice(startIndex, startIndex + itemsPerPage.value);
});

// Function to check if the reservation date has passed
const isReservationPast = (reservationDate: Date) => {
  const currentDate = new Date();
  return currentDate > new Date(reservationDate);
};

// Check if the user has commented on the reservation
const hasCommented = (reservationId: string) => {
  if (!userId.value) return false; // Vérifiez si l'utilisateur est connecté
  const comments = commentStore.comments.filter(comment => comment.reservation === reservationId && comment.user === userId.value);
  return comments.length > 0;
};

// Function to determine if the review button should be shown
const shouldShowReviewButton = (reservationDate: Date) => {
  const reservationDateObj = new Date(reservationDate);
  const currentDate = new Date();
  return currentDate >= reservationDateObj ;
};


// Function to get restaurant name by ID
const getRestaurantName = (restaurantId: string) => {
  const restaurant = restaurantStore.getRestaurantById(restaurantId);
  return restaurant ? restaurant.name : 'Nom non disponible';
};

// Function to start editing a reservation
const startEditing = (reservation: IReservation) => {
  editingReservation.value = { ...reservation };
  editedReservationDate.value = new Date(reservation.reservationDate).toLocaleDateString('en-CA'); 

  editedReservationTime.value = new Date(reservation.reservationDate).toTimeString().split(' ')[0].slice(0, 5);
};

// Function to cancel a reservation
const cancelReservation = async (reservationId: string) => {
  if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
    await reservationStore.deleteReservation(reservationId);
    if (userId.value) {
      await reservationStore.fetchUserReservations(userId.value);
    }
    alert('Réservation annulée avec succès.');
    updatePagination(); // Update pagination after deletion
  }
};

// Function to update a reservation
const updateReservation = async () => {
  if (!editingReservation.value) return;

  try {
    const combinedDateTime = new Date(`${editedReservationDate.value}T${editedReservationTime.value}`);
    const updatedReservation = {
      ...editingReservation.value,
      reservationDate: combinedDateTime
    };

    await reservationStore.updateReservation(updatedReservation._id, updatedReservation);
    if (userId.value) {
      await reservationStore.fetchUserReservations(userId.value);
    }
    editingReservation.value = null;
    editedReservationDate.value = null;
    editedReservationTime.value = null;
    alert('Réservation mise à jour avec succès.');
    updatePagination(); // Update pagination after update
  } catch (error) {
    alert('Erreur lors de la mise à jour de la réservation.');
  }
};

// Function to cancel editing a reservation
const cancelEditing = () => {
  editingReservation.value = null;
  editedReservationDate.value = null;
  editedReservationTime.value = null;
};

// Function to navigate to the review page
const goToReviewPage = (restaurantId: string, reservationId: string) => {
  router.push(`/restaurant/${restaurantId}/review/${reservationId}`);
};

// Functions for pagination
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

</script>


<template>
    <NavigationBar />
    <div class="myReservation">
  <h1>{{ $t('title') }}</h1>

  <div v-if="currentReservations.length > 0">
    <table>
      <thead>
        <tr>
          <th>{{ $t('date') }}</th>
          <th>{{ $t('time') }}</th>
          <th>{{ $t('guests') }}</th>
          <th>{{ $t('restaurant') }}</th>
          <th>{{ $t('actions') }}</th>
          <th>{{ $t('review') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reservation in currentReservations" :key="reservation._id">
          <td>
            <template v-if="editingReservation && editingReservation._id === reservation._id">
              <input type="date" v-model="editedReservationDate" required />
            </template>
            <template v-else>
              {{ new Date(reservation.reservationDate).toLocaleDateString() }}
            </template>
          </td>
          <td>
            <template v-if="editingReservation && editingReservation._id === reservation._id">
              <input type="time" v-model="editedReservationTime" required />
            </template>
            <template v-else>
              {{ new Date(reservation.reservationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
            </template>
          </td>
          <td>
            <template v-if="editingReservation && editingReservation._id === reservation._id">
              <input type="number" v-model="editingReservation.numberOfPersons" required />
            </template>
            <template v-else>
              {{ reservation.numberOfPersons }}
            </template>
          </td>
          <td>{{ getRestaurantName(reservation.restaurant) }}</td>
          <td>
            <div v-if="!isReservationPast(reservation.reservationDate)">
              <template v-if="editingReservation && editingReservation._id === reservation._id">
                <button class="primary-button" @click="updateReservation">{{ $t('save') }}</button>
                <button class="secondary-button" @click="cancelEditing">{{ $t('cancel') }}</button>
              </template>
              <template v-else>
                <button class="primary-button" @click="startEditing(reservation)">{{ $t('edit') }}</button>
                <button class="secondary-button" @click="cancelReservation(reservation._id)">{{ $t('cancel') }}</button>
              </template>
            </div>
          </td>
          <td>
            <button 
              v-if="shouldShowReviewButton(reservation.reservationDate) && !hasCommented(reservation._id)"
              class="primary-button"
              @click="goToReviewPage(reservation.restaurant, reservation._id)"
            >
              {{ $t('leaveReview') }}
            </button>
            <button 
              v-else-if="shouldShowReviewButton(reservation.reservationDate) && hasCommented(reservation._id)"
              class="disabled-button"
              disabled
            >
              {{ $t('reviewGiven') }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button @click="previousPage" :disabled="currentPage === 1">{{ $t('previous') }}</button>
      <span>{{ $t('pageInfo', { currentPage, totalPages }) }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">{{ $t('next') }}</button>
    </div>
  </div>

  <div v-else>
    <p>{{ $t('noReservations') }}</p>
  </div>
</div>

    <Footer></Footer>
  </template>
  

<style scoped>
@keyframes slideInFromLeft {
    from {
        transform: translateX(-100%); /* Commence hors de l'écran à gauche */
        opacity: 0; /* Commence transparent */
    }
    to {
        transform: translateX(0); /* Termine à sa position originale */
        opacity: 1; /* Termine complètement visible */
    }
}

h1 {
    text-align: center; /* Centre le texte */
    color: #333;
    font-size: 2em;
    margin-bottom: 20px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    animation: slideInFromLeft 1s ease forwards; /* Applique l'animation */
}

.myReservation {
    background: url('@/assets/image/fondEcran.webp') no-repeat;
    background-size: cover;
    max-width: 85%; /* Limite la largeur pour un meilleur aspect */
    margin: 20px auto; /* Centre le conteneur */
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Ombre légère autour du conteneur */
    
}

body {
    background: linear-gradient(rgba(0, 188, 212, 0.6), rgba(0, 188, 212, 0.6)), 
    url('@/assets/image/fond-ecran.webp') no-repeat center center fixed;
    background-size: cover;
  font-family: 'Roboto', sans-serif;
  margin: 20px;
  padding: 20px;
  color: #333;
}

h1 {
  text-align: center;
  color: #333;
  font-size: 2em;
  margin-bottom: 20px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

table {
 
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: white;
  border-radius: 5px;
  animation: fadeIn 0.5s ease forwards;
}

th, td {

  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  transition: background-color 0.3s;
}

tr:hover {

  background-color: #f1f1f1;
}

th {  
  background-color: #00bcd4;
  color: white;
}

.primary-button:hover {
  background-color: #77d2de; /* Darker shade on hover */
}

.secondary-button,.primary-button {
  background-color: #00bcd4; /* Secondary button color */
  margin-left: 15px;
  color: white;
  width: 100px; /* Ajustez la largeur comme vous le souhaitez */
  height: 40px; /* Ajustez la hauteur comme vous le souhaitez */
  margin: 5px; /* Espace autour des boutons */
  text-align: center;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.secondary-button:hover {
  background-color: #da2b2b; /* Darker shade on hover */
}

.disabled-button {
  background-color: #e0e0e0;
  color: #aaa;
  cursor: not-allowed;
  border-radius: 20px;
  width: 100px; /* Ajustez la largeur comme vous le souhaitez */
  height: 40px; /* Ajustez la hauteur comme vous le souhaitez */
  margin: 5px; /* Espace autour des boutons */
  text-align: center;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 10px;
  width: 100px; /* Ajustez la largeur comme vous le souhaitez */
  height: 40px;
  padding: 10px 15px;
  border: none;
  border-radius: 20px;
  background-color: #00bcd4; /* Primary button color for pagination */
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination button:hover {
  background-color: #00bcd4;
   /* Darker shade on hover for pagination */
}

.pagination button:disabled {
  background-color: #e0e0e0; /* Disabled button color */
  cursor: not-allowed;
  color: rgb(66, 66, 66);
}
.pagination span{
    margin-top: 10px
}

</style>
