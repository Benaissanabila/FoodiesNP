<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useReservationStore } from '@/stores/ReservationStore';
import { useUserStore } from '@/stores/UserStore';
import { useRestaurantStore } from '@/stores/RestaurantStore';
import type { IReservation } from '@/shared/interfaces/ReservationInterface';
import { useRouter } from 'vue-router'; 
import { useCommentStore } from '@/stores/CommentStore';
import NavigationBar from '@/components/NavigationBar.vue';

const reservationStore = useReservationStore();
const userStore = useUserStore();
const restaurantStore = useRestaurantStore();
const commentStore = useCommentStore();
const router = useRouter();

const userId = ref<string | null>(null);
const editingReservation = ref<IReservation | null>(null);
const editedReservationDate = ref<string | null>(null);
const editedReservationTime = ref<string | null>(null);

onMounted(async () => {
  userStore.checkAuth();
  if (userStore.user && userStore.user._id) {
    userId.value = userStore.user._id;
    await reservationStore.fetchUserReservations(userId.value);
    
    const restaurantIds = reservationStore.reservations.map(reservation => reservation.restaurant);
    await Promise.all(restaurantIds.map(id => restaurantStore.fetchRestaurantById(id)));
  }
});

const isReservationPast = (reservationDate: Date) => {
  const currentDate = new Date();
  return currentDate > new Date(reservationDate);
};

const hasCommented = (reservationId: string) => {
  const comments = commentStore.comments.filter(comment => comment.reservation === reservationId && comment.user === userId.value);
  return comments.length > 0;
};

const shouldShowReviewButton = (reservationDate: Date) => {
  const reservationDateObj = new Date(reservationDate);
  const currentDate = new Date();
  const oneDayAfterReservation = new Date(reservationDateObj);
  oneDayAfterReservation.setDate(reservationDateObj.getDate() + 1);
  return currentDate >= oneDayAfterReservation;
};

const getRestaurantName = (restaurantId: string) => {
  const restaurant = restaurantStore.getRestaurantById(restaurantId);
  return restaurant ? restaurant.name : 'Nom non disponible';
};

const startEditing = (reservation: IReservation) => {
  editingReservation.value = { ...reservation };
  editedReservationDate.value = new Date(reservation.reservationDate).toISOString().split('T')[0];
  editedReservationTime.value = new Date(reservation.reservationDate).toTimeString().split(' ')[0].slice(0, 5);
};

const cancelReservation = async (reservationId: string) => {
  if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
    await reservationStore.deleteReservation(reservationId);
    if (userId.value) {
      await reservationStore.fetchUserReservations(userId.value);
    }
    alert('Réservation annulée avec succès.');
  }
};

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
  } catch (error) {
    alert('Erreur lors de la mise à jour de la réservation.');
  }
};

const cancelEditing = () => {
  editingReservation.value = null;
  editedReservationDate.value = null;
  editedReservationTime.value = null;
};

const goToReviewPage = (restaurantId: string, reservationId: string) => {
  router.push(`/restaurant/${restaurantId}/review/${reservationId}`);
};
</script>

<template>
  <NavigationBar />
  <div>
    <h1>Mes Réservations</h1>

    <div v-if="reservationStore.reservations.length > 0">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Heure</th>
            <th>Invités</th>
            <th>Restaurant</th>
            <th>Actions</th>
            <th>Avis</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reservation in reservationStore.reservations" :key="reservation._id">
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
                  <button @click="updateReservation">Sauvegarder</button>
                  <button @click="cancelEditing">Annuler</button>
                </template>
                <template v-else>
                  <button @click="startEditing(reservation)">Modifier</button>
                  <button @click="cancelReservation(reservation._id)">Annuler</button>
                </template>
              </div>
            </td>
            <td>
              <button v-if="shouldShowReviewButton(reservation.reservationDate) && !hasCommented(reservation._id)" 
                      @click="goToReviewPage(reservation.restaurant, reservation._id)">Laisser un avis</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else>
      <p>Aucune réservation trouvée pour cet utilisateur.</p>
    </div>
  </div>
</template>


<style scoped>
/* Style pour le conteneur principal */
div {
  max-width: 800px; /* Limite la largeur pour un meilleur aspect */
  margin: 20px auto; /* Centre le conteneur */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Ombre légère autour du conteneur */
  background-color: #f9f9f9; /* Couleur de fond */
}

/* Style pour les titres */
h1 {
  text-align: center;
  color: #333; /* Couleur du texte */
}

/* Style pour la liste des réservations */
table {
  width: 100%; /* Table prend toute la largeur */
  border-collapse: collapse; /* Supprime l'espace entre les bordures */
}

th, td {
  padding: 10px; /* Espacement interne */
  text-align: left; /* Alignement à gauche */
  border-bottom: 1px solid #ddd; /* Bordure entre les lignes */
}

th {
  background-color: #007bff; /* Couleur d'arrière-plan pour les en-têtes */
  color: white; /* Couleur du texte des en-têtes */
}

/* Style pour les boutons */
button {
  background-color: #007bff; /* Couleur principale du bouton */
  color: white; /* Couleur du texte */
  border: none; /* Pas de bordure */
  border-radius: 4px; /* Coins arrondis */
  padding: 10px 15px; /* Espacement interne */
  margin-right: 10px; /* Espacement entre les boutons */
  cursor: pointer; /* Curseur en main pour indiquer le clic */
  transition: background-color 0.3s; /* Animation de couleur */
}

/* Effet au survol des boutons */
button:hover {
  background-color: #0056b3; /* Couleur plus foncée au survol */
}

/* Style pour les messages d'erreur */
.error-message {
  color: red; /* Couleur rouge pour les messages d'erreur */
  margin-top: 5px; /* Espacement au-dessus des messages */
}
</style>
