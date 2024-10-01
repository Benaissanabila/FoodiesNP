import { defineStore } from 'pinia';
import axios from 'axios';
import { useRouter } from 'vue-router';
import type { ICreateUser } from '@/shared/interfaces/CreateUserInterface'; // Importer la nouvelle interface

const router = useRouter();

export const useUserStore = defineStore('UserStore', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
  }),

  actions: {
    async createUser(userData: ICreateUser) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('http://localhost:3000/users', userData);
        this.user = response.data;
      } catch (error: any) {
        this.error = error.response?.data?.error || 'An error occurred during account creation';
      } finally {
        this.loading = false;
      }
    },

    async loginUser(email: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('http://localhost:3000/users/login', { email, password });
        this.user = response.data.user;
      } catch (error: any) {
        this.error = error.response?.data?.error || 'An error occurred during login';
      } finally {
        this.loading = false;
      }
    },

    logoutUser() {
      this.user = null;
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
  },
});
