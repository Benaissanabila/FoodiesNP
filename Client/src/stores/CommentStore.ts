// src/stores/commentStore.ts

import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import type { IComment } from '@/shared/interfaces/CommentInterface'; // Assurez-vous que le chemin est correct

export const useCommentStore = defineStore('comment', {
    state: () => ({
        comments: ref<IComment[]>([]), // Liste des commentaires
        loading: ref<boolean>(false),    // Indicateur de chargement
        error: ref<string | null>(null)   // Indicateur d'erreur
    }),

    getters: {
        // Getter pour obtenir tous les commentaires
        getAllComments(state) {
            return state.comments;
        },
// Getter pour obtenir les commentaires d'un restaurant par son ID
getCommentsByRestaurantId: (state) => (restaurantId: string) => {
    return state.comments.filter(comment => comment.restaurant === restaurantId);
  }
        
    },

    actions: {
        // Action pour récupérer tous les commentaires
        async loadComments() {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get('http://localhost:3000/comments'); 
                this.comments = response.data; 
            } catch (error) {
                console.error('Erreur lors de la récupération des commentaires:', error);
                this.error = 'Erreur lors de la récupération des commentaires';
            } finally {
                this.loading = false;
            }
        },

        // Action pour ajouter un commentaire
        async addComment(comment: IComment) {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.post('http://localhost:3000/comments', comment); // Remplace par ton URL
                this.comments.push(response.data); // Ajoute le nouveau commentaire à la liste
            } catch (error) {
                console.error('Erreur lors de l\'ajout du commentaire:', error);
                this.error = 'Erreur lors de l\'ajout du commentaire';
            } finally {
                this.loading = false;
            }
        },
       
   // Action pour liker un commentaire
  // Action pour liker un commentaire
async likeComment(commentId: string) {
    try {
      // Suppression de l'apostrophe supplémentaire avant l'URL
      await axios.put(`http://localhost:3000/comments/${commentId}`, { action: 'like' });
      const comment = this.comments.find(comment => comment._id === commentId);
      if (comment) {
        comment.upvotes = (comment.upvotes ?? 0) + 1;
      }
    } catch (error) {
      console.error('Erreur lors du like du commentaire:', error);
    }
  },
  
  async dislikeComment(commentId: string) {
    try {
      await axios.put(`http://localhost:3000/comments/${commentId}`, { action: 'dislike' });
      const comment = this.comments.find(comment => comment._id === commentId);
      if (comment) {
        comment.downvotes = (comment.downvotes ?? 0) + 1;
      }
    } catch (error) {
      console.error('Erreur lors du dislike du commentaire:', error);
    }
  },
  
  async unlikeComment(commentId: string) {
    try {
      await axios.put(`http://localhost:3000/comments/${commentId}`, { action: 'unlike' });
      const comment = this.comments.find(comment => comment._id === commentId);
      if (comment) {
        comment.upvotes = Math.max((comment.upvotes ?? 0) - 1, 0);
      }
    } catch (error) {
      console.error('Erreur lors de l\'unlike du commentaire:', error);
    }
  },
  
  async undislikeComment(commentId: string) {
    try {
      await axios.put(`http://localhost:3000/comments/${commentId}`, { action: 'undislike' });
      const comment = this.comments.find(comment => comment._id === commentId);
      if (comment) {
        comment.downvotes = Math.max((comment.downvotes ?? 0) - 1, 0);
      }
    } catch (error) {
      console.error('Erreur lors de l\'undislike du commentaire:', error);
    }
  }
  
},
});

