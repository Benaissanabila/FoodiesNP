import { defineStore } from 'pinia';
import axios from 'axios';
import type { IOwner } from '@/shared/interfaces/OwnerInterface'; // Assurez-vous que l'interface IOwner est définie

export const useOwnerStore = defineStore('OwnerStore', {
  state: () => ({
    owner: null as IOwner | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    // Action pour récupérer un owner par user ID
    async fetchOwnerByUser(userId: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get<IOwner>(`http://localhost:3000/owners/user/${userId}`);
        this.owner = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération du propriétaire:', error);
        this.error = 'Erreur lors de la récupération du propriétaire';
      } finally {
        this.loading = false;
      }
    },
  },
});
