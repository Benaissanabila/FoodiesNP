<template>
    <div class="review-container">
      <h1 class="review-title">Questionnaire d’appréciation</h1>
      <h2 class="review-subtitle">Vous avez visité {{ restaurant?.name }}</h2>
  
      <div v-if="restaurant">
        <div class="rating-section">
          <label class="rating-label">Comment avez-vous trouvé la nourriture ?</label>
          <div class="stars">
            <span v-for="star in 5" :key="star" @click="setFoodRating(star)" class="star">
              <span v-if="foodRating >= star">★</span>
              <span v-else>☆</span>
            </span>
          </div>
        </div>
  
        <div class="rating-section">
          <label class="rating-label">Comment avez-vous trouvé l’ambiance ?</label>
          <div class="stars">
            <span v-for="star in 5" :key="star" @click="setAmbianceRating(star)" class="star">
              <span v-if="ambianceRating >= star">★</span>
              <span v-else>☆</span>
            </span>
          </div>
        </div>
  
        <div class="rating-section">
          <label class="rating-label">Comment avez-vous trouvé le service ?</label>
          <div class="stars">
            <span v-for="star in 5" :key="star" @click="setServiceRating(star)" class="star">
              <span v-if="serviceRating >= star">★</span>
              <span v-else>☆</span>
            </span>
          </div>
        </div>
  
        <div class="comment-section">
          <label class="comment-label">Laissez un commentaire :</label>
          <textarea v-model="comment" class="comment-input" rows="4"></textarea>
        </div>
  
        <button class="submit-button" @click="submitReview">Soumettre mon évaluation</button>
      </div>
  
      <div v-else>
        <p class="loading-message">Chargement du restaurant...</p>
      </div>
    </div>
  </template>
  
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useRestaurantStore } from '@/stores/RestaurantStore';
  import { useCommentStore } from '@/stores/CommentStore';
  import { useUserStore } from '@/stores/UserStore';
  import type { IComment } from '@/shared/interfaces/CommentInterface';
  import type { IRestaurant } from '@/shared/interfaces/RestaurantInterface';
  import type { IUser } from '@/shared/interfaces/UserInterface';
import { useReservationStore } from '@/stores/ReservationStore';
  
  export default defineComponent({
    setup() {
      const route = useRoute();
      const restaurantStore = useRestaurantStore();
      const userStore = useUserStore();
      const commentStore = useCommentStore();
      const reservationStore = useReservationStore();
      const restaurantId = route.params.id as string; 
      
      const restaurant = ref<IRestaurant | null>(null);
      const user = ref<IUser | null>(null);
        const reservationId = route.params.reservationId as string;
      const foodRating = ref(0);
      const ambianceRating = ref(0);
      const serviceRating = ref(0);
      const comment = ref('');
  
      onMounted(async () => {
        // Fetch restaurant details
        
        await restaurantStore.fetchRestaurantById(restaurantId);
        restaurant.value = restaurantStore.restaurants.find((r) => r._id === restaurantId) || null;
        
        // Fetch reservation details
  await reservationStore.fetchReservationById(reservationId); // Appel de votre fonction pour récupérer la réservation
  console.log("data", reservationStore)
  const reservation = reservationStore.currentReservation; // Récupérer la réservation stockée dans le store
  console.log("reservation",reservation)
  if (!reservation) {
    console.error("Aucune réservation trouvée.");
    return;
  }

        await userStore.checkAuth();
        user.value = userStore.user; 
  console.log("user",userStore)
        if (!restaurant.value) {
          console.error("Aucun restaurant trouvé avec cet ID.");
        }
  
        if (!user.value) {
          console.warn("Aucun utilisateur trouvé.");
        } else {
          console.log("Utilisateur trouvé :", user.value);
        }
      });
    
      const setFoodRating = (rating: number) => {
        foodRating.value = rating;
        console.log("food",foodRating.value)
      };
  
      const setAmbianceRating = (rating: number) => {
        ambianceRating.value = rating;
        console.log("ambiance",ambianceRating.value)
      };
  
      const setServiceRating = (rating: number) => {
        serviceRating.value = rating;
        console.log("service",serviceRating.value)
      };
  
      const submitReview = async () => {
  if (!user.value || !user.value._id) {
    console.error("Utilisateur non authentifié. Veuillez vous connecter.");
    return;
  }

  if (!reservationStore.currentReservation) {
    console.error("Aucune réservation disponible pour soumettre un commentaire.");
    return;
  }
  if (!foodRating.value || !ambianceRating.value || !serviceRating.value) {
    alert("Veuillez évaluer tous les aspects !");
    return;
  }

  if (!comment.value) {
    alert("Veuillez laisser un commentaire !");
    return;
  }
        const newComment= {
      
            user: user.value._id,
  reservation: reservationStore.currentReservation._id,
  quality: foodRating.value,
  service: serviceRating.value,
  ambiance: ambianceRating.value,
  comment: comment.value,
  createdAt: new Date(),
  restaurant: restaurantId,
        };
  
        try {
          await commentStore.addComment(newComment);
          console.log("Commentaire soumis avec succès !");
        } catch (error) {
          console.error("Erreur lors de la soumission du commentaire :", error);
        }
      };
  
      return {
        restaurant,
        user,
        foodRating,
        ambianceRating,
        serviceRating,
        comment,
        setFoodRating,
        setAmbianceRating,
        setServiceRating,
        submitReview,
      };
    },
  });
  </script>
  
 <style scoped>
/* Style pour le conteneur principal */
.review-container {
  max-width: 800px; /* Limite la largeur pour un meilleur aspect */
  margin: 20px auto; /* Centre le conteneur */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Ombre légère autour du conteneur */
  background-color: #ffffff; /* Fond blanc */
}

/* Style pour les titres */
.review-title {
  text-align: center; /* Centrer le titre principal */
  color: #333; /* Couleur du texte */
  margin-bottom: 20px; /* Espacement sous le titre */
}

.review-subtitle {
  text-align: center; /* Centrer le sous-titre */
  color: #555; /* Couleur légèrement plus claire */
}

/* Style pour les sections d'évaluation */
.rating-section {
  margin-top: 15px; /* Espacement au-dessus des sections d'évaluation */
}

/* Style pour les labels */
.rating-label {
  font-weight: bold; /* Met le texte en gras */
  color: #444; /* Couleur du texte des labels */
  display: block; /* Affiche les labels en bloc pour qu'ils soient sur une nouvelle ligne */
}

/* Style pour les étoiles d'évaluation */
.stars {
  display: flex; /* Utilisation de flexbox pour aligner les étoiles */
  align-items: center; /* Aligne les étoiles verticalement au centre */
}

.star {
  font-size: 24px; /* Taille des étoiles */
  cursor: pointer; /* Curseur en main pour indiquer le clic */

  color: #ffcc00; /* Couleur des étoiles */
  margin-right: 5px; /* Espacement entre les étoiles */
}

/* Style pour la zone de commentaire */
.comment-section {
  margin-top: 20px; /* Espacement au-dessus de la zone de commentaire */
}

.comment-label {
  font-weight: bold; /* Met le texte en gras */
  color: #444; /* Couleur du texte des labels */
}

.comment-input {
  width: 100%; /* Prend toute la largeur */
  padding: 10px; /* Espacement interne */
  border: 1px solid #ccc; /* Bordure grise */
  border-radius: 4px; /* Coins arrondis */
  margin-top: 10px; /* Espacement au-dessus du champ */
  resize: vertical; /* Permet de redimensionner verticalement */
}

/* Style pour le bouton de soumission */
.submit-button {
  background-color: #00bcd4; /* Couleur principale du bouton */
  color: white; /* Couleur du texte */
  border: none; /* Pas de bordure */
  border-radius: 4px; /* Coins arrondis */
  padding: 10px 15px; /* Espacement interne */
  margin-top: 20px; /* Espacement au-dessus du bouton */
  cursor: pointer; /* Curseur en main pour indiquer le clic */
  transition: background-color 0.3s; /* Animation de couleur */

}

/* Effet au survol du bouton */
.submit-button:hover {
  background-color: #77d2de; /* Couleur plus foncée au survol */
}

/* Style pour le message de chargement */
.loading-message {
  text-align: center; /* Centre le message */
  color: #888; /* Couleur grise pour le message de chargement */
}
</style>


  