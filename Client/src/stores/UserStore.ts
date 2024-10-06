import { defineStore } from 'pinia';
import axios from 'axios';
import type { IUser } from '@/shared/interfaces/UserInterface';

export const useUserStore = defineStore('UserStore', {
  state: () => ({
    user: null as IUser | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async createUser(formData: FormData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('http://localhost:3000/users', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        this.user = response.data;
        localStorage.setItem('user', JSON.stringify(this.user));
        console.log('User created and stored:', this.user);
      } catch (error: any) {
        this.error = error.response?.data?.error || 'An error occurred during account creation';
        console.error('Error creating user:', this.error);
      } finally {
        this.loading = false;
      }
    },

    async loginUser(email: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('http://localhost:3000/users/login', { email, password });
        this.user = response.data;
        localStorage.setItem('user', JSON.stringify(this.user));
        console.log('User logged in and stored:', this.user);
      } catch (error: any) {
        this.error = error.response?.data?.error || 'An error occurred during login';
        console.error('Error logging in:', this.error);
      } finally {
        this.loading = false;
      }
    },

    logoutUser() {
      this.user = null;
      localStorage.removeItem('user');
      console.log('User logged out');
    },

    checkAuth() {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
        console.log('Stored user found:', this.user);
      } else {
        console.log('No stored user found');
      }
    },
    // Ajoutez cette méthode dans le store des utilisateurs
async fetchUserById(userId: string) {
  try {
    const response = await axios.get(`http://localhost:3000/users/${userId}`);
    return response.data; // Retourne les données de l'utilisateur
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    throw new Error('Erreur lors de la récupération de l\'utilisateur');
  }
}
  },

  getters: {
    isAuthenticated(): boolean {
      return !!this.user;
    },
  },
});