<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // Importez useRouter
import { useRestaurantStore } from '@/stores/RestaurantStore';
import { useCommentStore } from '@/stores/CommentStore';
import { useUserStore } from '@/stores/UserStore';
import type { IRestaurant } from '@/shared/interfaces/RestaurantInterface';
import type { IUser } from '@/shared/interfaces/UserInterface';
import { useReservationStore } from '@/stores/ReservationStore';

import NavigationBar from '@/components/NavigationBar.vue';
import Footer from '@/components/Footer.vue';

export default defineComponent({
  components: {
    NavigationBar,
    Footer,
  },
  setup() {
    const route = useRoute();
    const router = useRouter(); // Créez une instance de useRouter
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
    const thankYouMessageVisible = ref(false); // Nouvelle propriété

    onMounted(async () => {
      // Fetch restaurant details
      await restaurantStore.fetchRestaurantById(restaurantId);
      restaurant.value = restaurantStore.restaurants.find((r) => r._id === restaurantId) || null;

      // Fetch reservation details
      await reservationStore.fetchReservationById(reservationId);
      const reservation = reservationStore.currentReservation;

      if (!reservation) {
        console.error("Aucune réservation trouvée.");
        return;
      }

      await userStore.checkAuth();
      user.value = userStore.user;

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
    };

    const setAmbianceRating = (rating: number) => {
      ambianceRating.value = rating;
    };

    const setServiceRating = (rating: number) => {
      serviceRating.value = rating;
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
      const newComment = {
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
        thankYouMessageVisible.value = true; // Afficher le message de remerciement
      } catch (error) {
        console.error("Erreur lors de la soumission du commentaire :", error);
      }
    };

    const goBackToRestaurant = () => {
      router.push(`/restaurantdetails/${restaurantId}`); // Redirige vers la page du restaurant
    };

    return {
      restaurant,
      user,
      foodRating,
      ambianceRating,
      serviceRating,
      comment,
      thankYouMessageVisible, // Exposez la nouvelle propriété
      setFoodRating,
      setAmbianceRating,
      setServiceRating,
      submitReview,
      goBackToRestaurant, // Exposez la méthode de redirection
    };
  },
});
</script>

<template>
    <NavigationBar />
    <div class="review-container">
      <h1 class="review-title">Questionnaire d’appréciation</h1>
      <h2 class="review-subtitle">Vous avez visité {{ restaurant?.name }}</h2>
  
      <div v-if="restaurant">
        <div class="rating-section">
          <div class="rating-label-container">
            <label class="rating-label">Comment avez-vous trouvé la nourriture ?</label>
            <div class="stars">
              <span v-for="star in 5" :key="star" @click="setFoodRating(star)" class="star">
                <span v-if="foodRating >= star">★</span>
                <span v-else>☆</span>
              </span>
            </div>
          </div>
        </div>
  
        <div class="rating-section">
          <div class="rating-label-container">
            <label class="rating-label">Comment avez-vous trouvé l’ambiance ?</label>
            <div class="stars">
              <span v-for="star in 5" :key="star" @click="setAmbianceRating(star)" class="star">
                <span v-if="ambianceRating >= star">★</span>
                <span v-else>☆</span>
              </span>
            </div>
          </div>
        </div>
  
        <div class="rating-section">
          <div class="rating-label-container">
            <label class="rating-label">Comment avez-vous trouvé le service ?</label>
            <div class="stars">
              <span v-for="star in 5" :key="star" @click="setServiceRating(star)" class="star">
                <span v-if="serviceRating >= star">★</span>
                <span v-else>☆</span>
              </span>
            </div>
          </div>
        </div>
  
        <div class="comment-section">
          <label class="comment-label">Laissez un commentaire :</label>
          <textarea v-model="comment" class="comment-input" rows="4"></textarea>
        </div>
  
        <button class="submit-button" @click="submitReview">Soumettre mon évaluation</button>
      </div>
  
      <div v-if="thankYouMessageVisible" class="thank-you-message">
        <p>Merci pour votre évaluation !</p>
        <button @click="goBackToRestaurant">OK</button>
      </div>
  
    </div>
    <Footer />
  </template>
  
  
  
  
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
.rating-label-container {
  display: flex;
  align-items: center; /* Aligne les éléments verticalement */
}

.rating-label {
  margin-right: 10px; /* Ajoute de l'espace entre le label et les étoiles */
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
    margin-left: 20px;
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
 
  border: 1px solid #ccc; /* Bordure grise */
  border-radius: 4px; /* Coins arrondis */
  margin-top: 10px; /* Espacement au-dessus du champ */
 
  resize: vertical; /* Permet de redimensionner verticalement */
  transition: border-color 0.3s; /* Animation pour la bordure */
}

/* Changer la couleur de la bordure au focus */
.comment-input:focus {
  border-color: #00bcd4; /* Bordure bleue claire au focus */
  outline: none; /* Supprime le contour par défaut */
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
  transition: background-color 0.5s; /* Animation de couleur */
  display: block; /* Le bouton devient un bloc pour occuper toute la largeur disponible */
  margin-left: auto; /* Marge gauche automatique pour centrer */
  margin-right: auto; /* Marge droite automatique pour centrer */
  text-align: center; 
}

/* Effet au survol du bouton */
.submit-button:hover {
  background-color: #77d2de; /* Couleur plus foncée au survol */
}
.star:hover {
  transform: translateY(-3px); /* Légère élévation au survol */
}
.review-title, .review-subtitle {
  opacity: 0; /* Départ invisible */
  animation: fadeIn 1s forwards; /* Animation d'apparition */
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px); /* Déplace vers le haut */
  }
  to {
    opacity: 1;
    transform: translateY(0); /* Rétablit à la position initiale */
  }
}
/* Style pour le message de chargement */
.loading-message {
  text-align: center; /* Centre le message */
  color: #888; /* Couleur grise pour le message de chargement */
}
.thank-you-message {
  position: fixed; /* Utilisez une position fixe pour le superposer */
  top: 50%; /* Positionne le haut du message au milieu de la page */
  left: 50%; /* Positionne le côté gauche au milieu de la page */
  transform: translate(-50%, -50%); /* Centre le message */
  text-align: center; /* Centre le texte */
  padding: 20px; /* Espacement interne */
  border: 1px solid #00bcd4; /* Bordure pour le message */
  border-radius: 8px; /* Coins arrondis */
  background-color: rgba(240, 248, 255, 0.923); /* Couleur de fond semi-transparente */
  z-index: 1000; /* Assure que le message s'affiche au-dessus des autres éléments */
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3); /* Ajoute une ombre pour un effet de profondeur */
}
.thank-you-message button{
    background-color: #00bcd4;
    border-radius: 5px;
    padding: 5px;
    border: none;
}
.thank-you-message button:hover{
    background-color: #77d2de;
}
.review-container {
  position: relative; /* Assure que le conteneur peut être utilisé pour le positionnement relatif des éléments enfants */
}
</style>


  