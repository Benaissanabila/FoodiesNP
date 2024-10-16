<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useReservationStore } from '@/stores/ReservationStore';
import { useUserStore } from '@/stores/UserStore';
import { useRestaurantStore } from '@/stores/RestaurantStore';
import type { IReservation } from '@/shared/interfaces/ReservationInterface';
import { useRouter } from 'vue-router'; 
import { useCommentStore } from '@/stores/CommentStore'; // Importer le store des commentaires

const reservationStore = useReservationStore();
const userStore = useUserStore();
const restaurantStore = useRestaurantStore();
const commentStore = useCommentStore(); // Store pour gérer les commentaires
const router = useRouter();
const userId = ref<string | null>(null);
const editingReservation = ref<IReservation | null>(null);
const editedReservationDate = ref<string | null>(null); // To handle date input
const editedReservationTime = ref<string | null>(null); // To handle time input

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
// Fonction pour vérifier si l'utilisateur a déjà laissé un commentaire
const hasCommented = (reservationId: string) => {
  const comments = commentStore.comments.filter(comment => comment.reservation === reservationId && comment.user === userId.value);
  return comments.length > 0;
};

// Vérifier si le bouton pour laisser un avis doit être affiché
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
  editingReservation.value = { ...reservation }; // Create a copy of the reservation
  editedReservationDate.value = new Date(reservation.reservationDate).toISOString().split('T')[0]; // Set date input
  editedReservationTime.value = new Date(reservation.reservationDate).toTimeString().split(' ')[0].slice(0, 5); // Set time input
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
    // Combine edited date and time into a single Date object
    const combinedDateTime = new Date(`${editedReservationDate.value}T${editedReservationTime.value}`);
    const updatedReservation = {
      ...editingReservation.value,
      reservationDate: combinedDateTime // Set the combined date
    };

    await reservationStore.updateReservation(updatedReservation._id, updatedReservation);
    if (userId.value) {
      await reservationStore.fetchUserReservations(userId.value);
    }
    editingReservation.value = null; // Reset the form
    editedReservationDate.value = null; // Reset date input
    editedReservationTime.value = null; // Reset time input
    alert('Réservation mise à jour avec succès.');
  } catch (error) {
    alert('Erreur lors de la mise à jour de la réservation.');
  }
};

const cancelEditing = () => {
  editingReservation.value = null; // Reset the editing
  editedReservationDate.value = null; // Reset date input
  editedReservationTime.value = null; // Reset time input
};

const goToReviewPage = (restaurantId: string, reservationId: string) => {
  router.push(`/restaurant/${restaurantId}/review/${reservationId}`);
};
</script>


<template>
    <div>
      <h1>Mes Réservations</h1>
  
      <div v-if="reservationStore.reservations.length > 0">
        <ul>
          <li v-for="reservation in reservationStore.reservations" :key="reservation._id">
            <p>Réservation pour le {{ new Date(reservation.reservationDate).toLocaleDateString() }}</p>
            <p>Heure: {{ new Date(reservation.reservationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</p>
            <p>Nombre d'invités: {{ reservation.numberOfPersons }}</p>
            <p>Restaurant: {{ getRestaurantName(reservation.restaurant) }}</p>
            
            <!-- Vérifier si la réservation est passée pour afficher ou masquer les boutons -->
            <div v-if="!isReservationPast(reservation.reservationDate)">
              <button @click="startEditing(reservation)">Modifier</button>
              <button @click="cancelReservation(reservation._id)">Annuler</button>
            </div>
  
            <!-- Afficher le bouton pour laisser un avis si la date est passée d'un jour et l'utilisateur n'a pas commenté -->
            <button v-if="shouldShowReviewButton(reservation.reservationDate) && !hasCommented(reservation._id)" 
                    @click="goToReviewPage(reservation.restaurant, reservation._id)">Laisser un avis</button> 
  
            <div v-if="editingReservation && editingReservation._id === reservation._id">
              <h3>Modifier la Réservation</h3>
              <form @submit.prevent="updateReservation">
                <label>
                  Nombre d'invités:
                  <input type="number" v-model="editingReservation.numberOfPersons" required />
                </label>
                <label>
                  Date:
                  <input type="date" v-model="editedReservationDate" required />
                </label>
                <label>
                  Heure:
                  <input type="time" v-model="editedReservationTime" required />
                </label>
                <button type="submit">Sauvegarder</button>
                <button type="button" @click="cancelEditing">Annuler</button>
              </form>
            </div>
          </li>
        </ul>
        
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
  
  h3 {
    color: #555; /* Couleur pour les sous-titres */
  }
  
  /* Style pour la liste des réservations */
  ul {
    list-style: none; /* Supprime les puces */
    padding: 0;
  }
  
  li {
    background-color: #fff; /* Fond blanc pour chaque réservation */
    margin: 10px 0; /* Espacement entre les réservations */
    padding: 15px; /* Espacement interne */
    border-radius: 6px; /* Coins arrondis */
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1); /* Ombre légère */
  }
  
  /* Style pour les paragraphes */
  p {
    margin: 5px 0; /* Marges pour les paragraphes */
    color: #666; /* Couleur de texte gris pour les détails */
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
  
  /* Style pour les formulaires */
  form {
    margin-top: 10px; /* Espacement au-dessus du formulaire */
    display: flex;
    flex-direction: column; /* Colonne pour les champs de formulaire */
  }
  
  label {
    margin-bottom: 5px; /* Espacement sous chaque label */
    color: #333; /* Couleur du texte des labels */
  }
  
  input[type="number"],
  input[type="date"],
  input[type="time"] {
    padding: 10px; /* Espacement interne */
    border: 1px solid #ccc; /* Bordure grise */
    border-radius: 4px; /* Coins arrondis */
    margin-bottom: 10px; /* Espacement sous chaque champ */
  }
  
  /* Style pour les messages d'erreur */
  .error-message {
    color: red; /* Couleur rouge pour les messages d'erreur */
    margin-top: 5px; /* Espacement au-dessus des messages */
  }
  </style>
  