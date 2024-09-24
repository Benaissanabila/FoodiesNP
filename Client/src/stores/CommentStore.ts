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
       // Nouvelle action pour mettre à jour la note globale du restaurant
       async updateRestaurantRating(restaurantId: string) {
        this.loading = true;
        this.error = null;
        try {
            // Appel à l'API pour recalculer la note globale
            await axios.patch(`http://localhost:3000/restaurants/${restaurantId}/update-rating`); 
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la note globale du restaurant:', error);
            this.error = 'Erreur lors de la mise à jour de la note globale du restaurant';
        } finally {
            this.loading = false;
        }
    }  
    }
});
