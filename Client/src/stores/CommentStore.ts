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
   async likeComment(commentId: string) {
    this.loading = true;
    this.error = null;
    try {
        await axios.put(`http://localhost:3000/comments/${commentId}`, { action: 'like' });
        const comment = this.comments.find(c => c._id === commentId);
        if (comment) {
            // Initialiser upvotes s'il est indéfini
            comment.upvotes = comment.upvotes || 0;
            comment.upvotes += 1; // Incrémente
        }
    } catch (error) {
        console.error('Erreur lors du like du commentaire:', error);
        this.error = 'Erreur lors du like du commentaire';
    } finally {
        this.loading = false;
    }
},

// Action pour disliker un commentaire
async dislikeComment(commentId: string) {
    this.loading = true;
    this.error = null;
    try {
        await axios.put(`http://localhost:3000/comments/${commentId}`, { action: 'dislike' });
        const comment = this.comments.find(c => c._id === commentId);
        if (comment) {
            // Initialiser downvotes s'il est indéfini
            comment.downvotes = comment.downvotes || 0;
            comment.downvotes += 1; // Incrémente
        }
    } catch (error) {
        console.error('Erreur lors du dislike du commentaire:', error);
        this.error = 'Erreur lors du dislike du commentaire';
    } finally {
        this.loading = false;
    }
}
}
});

