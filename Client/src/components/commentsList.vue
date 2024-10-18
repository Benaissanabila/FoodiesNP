<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRestaurantStore } from '@/stores/RestaurantStore';
import { useUserStore } from '@/stores/UserStore';
import StarRating from '@/components/StarRating.vue';
import type { IComment } from '@/shared/interfaces/CommentInterface';
import { useCommentStore } from '@/stores/CommentStore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps<{
  restaurantId: string;
}>();

const commentStore = useCommentStore();
const restaurantStore = useRestaurantStore();
const userStore = useUserStore();

const comments = ref<IComment[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const userPhotos = ref<Record<string, string>>({});
const userNames = ref<Record<string, string>>({});
const userVotes = ref<Record<string, 'like' | 'dislike' | null>>({}); // Votes de l'utilisateur

// Récupérer les commentaires par ID du restaurant
onMounted(async () => {
  loading.value = true;
  error.value = null;
  try {
    // Fetch des commentaires depuis la base de données
    await restaurantStore.fetchCommentsByRestaurantId(props.restaurantId);
    comments.value = restaurantStore.comments;

    // Récupérer les données utilisateur pour chaque commentaire
    for (const comment of comments.value) {
      const userId = comment.user;
      if (!userPhotos.value[userId]) {
        const user = await userStore.fetchUserById(userId);
        console.log("user",user)
        userPhotos.value[userId] = user.UserPhoto;
        
        userNames.value[userId] = user.name;
      }
    }

    // Charger les votes de l'utilisateur à partir du localStorage
    const savedVotes = localStorage.getItem('userVotes');
    if (savedVotes) {
      userVotes.value = JSON.parse(savedVotes);
    }
  } catch (err) {
    console.error('Erreur lors de la récupération des commentaires:', err);
    error.value = 'Erreur lors de la récupération des commentaires.';
  } finally {
    loading.value = false;
  }
});
const showAllComments = ref(false); // Variable pour suivre l'affichage

// Propriété calculée pour limiter les commentaires affichés
const displayedComments = computed(() => {
  return showAllComments.value ? comments.value : comments.value.slice(0, 4);
});

// Méthode pour basculer l'affichage
const toggleShowAllComments = () => {
  showAllComments.value = !showAllComments.value;
};

// Sauvegarder les votes dans localStorage
const saveVotesToLocalStorage = () => {
  localStorage.setItem('userVotes', JSON.stringify(userVotes.value));
};

// Méthode pour formater la date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays < 30) {
    return `${diffInDays} jour(s) ago`;
  } else {
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} mois ago`;
  }
};

// Méthode pour toggler un like
const toggleLike = async (commentId: string) => {
  const currentVote = userVotes.value[commentId]; // Vote actuel de l'utilisateur
  const comment = comments.value.find((c) => c._id === commentId);

  try {
    if (currentVote === 'like') {
      // Si l'utilisateur a déjà liké, on annule le like
      await commentStore.unlikeComment(commentId);
      userVotes.value[commentId] = null; // Supprime le vote dans localStorage
      if (comment) {
        comment.upvotes = Math.max((comment.upvotes ?? 0) - 1, 0); // Décrémente le nombre de likes
      }
    } else {
      if (currentVote === 'dislike') {
        // Si l'utilisateur avait disliké, on annule le dislike avant de liker
        await commentStore.undislikeComment(commentId);
        if (comment) {
          comment.downvotes = Math.max((comment.downvotes ?? 0) - 1, 0); // Décrémente le nombre de dislikes
        }
      }

      // Enregistre le like
      await commentStore.likeComment(commentId);
      userVotes.value[commentId] = 'like'; // Enregistre le like dans localStorage
      if (comment) {
        comment.upvotes = (comment.upvotes ?? 0) + 1; // Incrémente le nombre de likes
      }
    }

    // Sauvegarde le vote dans localStorage et base de données
    saveVotesToLocalStorage();
  } catch (error) {
    console.error('Erreur lors du toggle du like:', error);
  }
};

// Méthode pour toggler un dislike
const toggleDislike = async (commentId: string) => {
  const currentVote = userVotes.value[commentId]; // Vote actuel de l'utilisateur
  const comment = comments.value.find((c) => c._id === commentId);

  try {
    if (currentVote === 'dislike') {
      // Si l'utilisateur a déjà disliké, on annule le dislike
      await commentStore.undislikeComment(commentId);
      userVotes.value[commentId] = null; // Supprime le vote dans localStorage
      if (comment) {
        comment.downvotes = Math.max((comment.downvotes ?? 0) - 1, 0); // Décrémente le nombre de dislikes
      }
    } else {
      if (currentVote === 'like') {
        // Si l'utilisateur avait liké, on annule le like avant de disliker
        await commentStore.unlikeComment(commentId);
        if (comment) {
          comment.upvotes = Math.max((comment.upvotes ?? 0) - 1, 0); // Décrémente le nombre de likes
        }
      }

      // Enregistre le dislike
      await commentStore.dislikeComment(commentId);
      userVotes.value[commentId] = 'dislike'; // Enregistre le dislike dans localStorage
      if (comment) {
        comment.downvotes = (comment.downvotes ?? 0) + 1; // Incrémente le nombre de dislikes
      }
    }

    // Sauvegarde le vote dans localStorage et base de données
    saveVotesToLocalStorage();
  } catch (error) {
    console.error('Erreur lors du toggle du dislike:', error);
  }
};
</script>





<template> 
<div>
    <h3>{{ t('avis') }}</h3>
    <div class="comment-card">
      <div v-if="loading">Chargement des commentaires...</div>
      <div v-if="error">{{ error }}</div>
      <div v-if="displayedComments.length > 0">
        <div v-for="comment in displayedComments" :key="comment._id" class="comment">
          <div class="user-info">
            <img 
              :src="userPhotos[comment.user] && userPhotos[comment.user].startsWith('http') 
              ? userPhotos[comment.user] 
              : `http://localhost:3000/uploads/${userPhotos[comment.user]}`" 
              alt="User Photo" 
              class="user-photo" 
            />
            <span class="user-name">{{ userNames[comment.user] }}</span>
          </div>
          <div class="content-comment">
            <div class="rating-info">
              <template v-if="comment.globalRating !== undefined">
  <StarRating :rating="comment.globalRating" />
</template>
<template v-else>
  <span>No rating</span>
</template>
              <span class="comment-date">{{ formatDate(comment.createdAt.toString()) }}</span>
            </div>
            <p class="comment-text">{{ comment.comment }}</p>
          </div>
          <div class="vote-buttons">
  <button @click="toggleLike(comment._id)" class="vote-button">
    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 1024 1024"
         :style="{ fill: userVotes[comment._id] === 'like' ? 'blue' : '#000000' }">
      <path d="M608.544 1023.744c-290.832 0-293.071-12.062-329.087-39.183c-19.104-14.368-55.151-24.32-186.815-32.896c-9.552-.624-18.64-4.288-24.735-11.68c-2.8-3.408-68.592-99.36-68.592-253.04c0-151.44 47.088-220.465 49.103-223.665a31.97 31.97 0 0 1 27.12-15.04c108.112 0 257.984-138 358.736-378.896C451.698 27.68 455.298.272 519.298.272c36.4 0 77.2 26.064 97.344 59.505c41.328 68.32 20.335 215.057.927 293.473c66-.528 185.472-1.425 242.32-1.425c79.072 0 131.407 47.152 132.991 116.08c.529 22.752-2.464 51.808-9.04 66.848c17.408 17.36 39.857 43.536 40.832 77.248c1.216 43.52-27.28 76.655-45.472 95.663c4.175 12.656 12.527 29.44 11.71 49.505c-2 49.344-40.095 81.136-63.823 97.727c1.968 13.504 3.504 38.976-.832 58.672c-17.12 78.609-132.4 110.177-317.712 110.177zM109.617 886.77c114.688 9.489 175.998 22.336 208.334 46.672c25.024 18.848 21.168 26.32 290.592 26.32c82.176 0 242.896-3.424 255.216-59.84c4.896-22.56-18.895-44.735-18.976-44.911c-6.496-16.032.737-34.849 16.577-41.777c.255-.128 64.143-23.007 65.6-58.72c.96-22.831-14.72-36.543-15.072-37.12c-9.328-14.463-5.92-34.303 8.224-44.16c.16-.128 41.551-25.215 40.543-59.423c-.784-27.168-36.576-46.289-37.664-46.928c-8-4.576-13.824-12.496-15.648-21.552c-1.792-9.04.224-18.528 5.84-25.872c0 0 16.272-25.856 15.68-50.112c-1.168-51.92-57.007-53.552-68.992-53.552c-80.72 0-288.03.816-288.03.816c-11.184.048-20.864-5.232-26.88-14.176c-6-8.945-6.448-20.048-2.928-30.224c31.263-90.032 48.72-231.28 19.727-279.536c-8.544-14.224-10.496-28.432-42.496-28.432c-4.432 0-14.991 3.504-25.999 29.744c-106.928 255.84-266.64 403.824-397.456 417.168c-11.28 25.728-32.496 79.04-32.496 175.775c0 98.737 31.28 175.12 46.305 199.84z"/>
    </svg>
    <span class="vote-count">{{ comment.upvotes }}</span>
  </button>

  <button @click="toggleDislike(comment._id)" class="vote-button">
    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 1024 1024"
         :style="{ fill: userVotes[comment._id] === 'dislike' ? 'blue' : '#000000' }">
      <path d="M415.44.24c290.832 0 293.089 12.066 329.104 39.187c19.104 14.368 55.151 24.335 186.831 32.912c9.568.624 18.64 4.288 24.736 11.68c2.8 3.408 68.592 99.36 68.592 253.023c0 151.44-47.088 220.48-49.103 223.696a31.99 31.99 0 0 1-27.12 15.024c-108.112 0-257.984 138-358.752 378.912c-17.424 41.664-21.008 69.055-85.024 69.055c-36.4 0-77.2-26.064-97.376-59.504c-41.311-68.32-20.336-215.057-.912-293.474c-66 .529-185.472 1.44-242.319 1.44c-79.072 0-131.393-47.151-133.009-116.096c-.512-22.752 2.464-51.824 9.056-66.832C22.752 471.903.288 445.71-.687 411.998c-1.233-43.504 27.279-76.64 45.455-95.664c-4.16-12.656-12.512-29.44-11.712-49.505c2.015-49.343 40.095-81.151 63.84-97.743c-1.953-13.456-3.489-38.944.832-58.624C114.848 31.838 230.128.238 415.44.238zm498.946 137.01c-114.688-9.488-175.996-22.338-208.332-46.69c-25.024-18.832-21.152-26.303-290.608-26.303c-82.176 0-242.896 3.424-255.216 59.824c-4.912 22.56 18.88 44.752 18.976 44.912c6.496 16.048-.752 34.878-16.569 41.81c-.254.128-64.144 23.007-65.6 58.72c-.96 22.823 14.72 36.544 15.072 37.12c9.328 14.463 5.92 34.303-8.224 44.16c-.16.128-41.537 25.215-40.528 59.423c.784 27.168 36.576 46.289 37.664 46.928c8 4.576 13.824 12.496 15.648 21.552c1.792 9.04-.224 18.528-5.84 25.872c0 0-16.272 25.856-15.68 50.112c1.168 51.92 57.007 53.552 68.992 53.552c80.72 0 288.03-.816 288.03-.816c11.184-.048 20.864 5.232 26.88 14.176c6 8.945 6.448 20.048 2.928 30.224c-31.263 90.032-48.72 231.28-19.727 279.536c8.544 14.224 10.496 28.432 42.496 28.432c4.432 0 14.991-3.504 25.999-29.744c106.928-255.84 266.64-403.824 397.456-417.168c11.28-25.728 32.496-79.04 32.496-175.775c0-98.737-31.28-175.12-46.305-199.84z"/>
    </svg>
    <span class="vote-count">{{ comment.downvotes }}</span>
  </button>
</div>

        </div>
      </div>
      <div v-else>Aucun avis trouvé.</div>
      <button v-if="comments.length >= 4" class="comment-toggle-button" @click="toggleShowAllComments">
      {{ showAllComments ? t('voirMoins') : t('voirTous') }}
    </button>
    </div>
  </div>
  </template>

  <style>

  .comment-card {
  background-color: #bceef6a1; /* Couleur de fond de la carte */
  border: 1px solid #ddd; /* Bordure de la carte */
  border-radius: 8px; /* Coins arrondis */
  padding: 16px; /* Espacement intérieur */
  margin: 16px; /* Espacement entre les cartes */


}


.comment {
    display: flex;
   border-bottom: 1.5px solid #373737; /* Bordure entre les commentaires */
  padding: 12px 0; /* Espacement intérieur entre les commentaires */
}
.content-comment{
    margin-left: 16px;
    flex: 1;
}
.user-info {
  display: flex;
  flex-direction: column; /* Affiche la photo et le nom en colonne */
  align-items: center; /* Centre horizontalement */
  width: 150px; /* Largeur fixe pour la section de l'utilisateur */
}

.user-photo {
  width: 60px; /* Largeur de la photo */
  height: 60px; /* Hauteur de la photo */
  border-radius: 50%; /* Photo ronde */
  margin-bottom: 5px; /* Espacement en bas de la photo */
}

.user-name {
  font-weight: bold; /* Texte en gras pour le nom de l'utilisateur */
  text-align: center; /* Centre le nom sous la photo */
}

.rating-info {
  display: flex;
  align-items: center; /* Alignement vertical des étoiles et de la date */
}

.comment-date {
  margin-left: 10px; /* Espacement à gauche de la date */
  font-size: 0.9em; /* Taille de police légèrement plus petite */
  color: #888; /* Couleur de la date */
  padding-top: 7px;
}

.comment-text {
  margin-top: 10px; /* Espacement au-dessus du commentaire */
  margin-bottom: 10px; /* Espacement en bas du commentaire */
}


.vote-buttons {
  display: flex;
  align-items: center;
}

.vote-button {
  display: flex;
  align-items: center;
  border: none;
  background: transparent;
  cursor: pointer;
  margin: 0 10px;
}

.vote-button svg {
  margin-right: 5px; /* Espace entre l'icône et le texte */
}

.vote-count {
  font-size: 1em; /* Ajustez la taille du texte si nécessaire */
}


h3{
    font-size: 2rem;
    margin-left: 18px;
}

.comment-toggle-button {
  padding: 8px 12px; /* Espacement intérieur */
  border: none; /* Pas de bordure */
  border-radius: 4px; /* Coins légèrement arrondis */
  background-color: #00bcd4; /* Couleur de fond verte */
  color: white; /* Couleur du texte */
  font-size: 14px; /* Taille de police */
  cursor: pointer; /* Curseur en forme de main */
  transition: background-color 0.3s, transform 0.2s; /* Transition pour les effets */
  margin-top: 10px; /* Marge en haut */
  display: block; /* Le bouton devient un bloc pour occuper toute la largeur disponible */
  margin-left: auto; /* Marge gauche automatique pour centrer */
  margin-right: auto; /* Marge droite automatique pour centrer */
  text-align: center; 
} 

.comment-toggle-button:hover {
  background-color: #77d2de; /* Couleur au survol */
}

.comment-toggle-button:active {
  transform: scale(0.95); /* Réduction légère lors du clic */
}

.comment-toggle-button:focus {
  outline: none; /* Supprime la bordure de focus */
  box-shadow: 0 0 0 3px #00bcd4; /* Ombre autour du bouton au focus */
}


@media (max-width: 768px) {
  .comment-card {
    padding: 5px;
  }

  .comment {
    padding: 10px;
  }

  .user-photo {
    width: 40px;
    height: 40px;
  }

  .comment-text {
    font-size: 12px;
  }

  .comment-date {
    font-size: 10px;
  }

  .vote-button svg {
    width: 1.5em;
    height: 1.5em;
  }}


  </style>
  