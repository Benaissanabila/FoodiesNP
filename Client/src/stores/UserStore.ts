import { defineStore } from 'pinia';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import type { IUser } from '@/shared/interfaces/UserInterface';

interface LoginResponse {
  user: IUser;
  token: string;
}
interface JwtPayload {
  exp: number;
  userId: string;
}

export const useUserStore = defineStore('UserStore', {
  state: () => ({
    user: null as IUser | null,
    token: null as string | null,
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
        const response = await axios.post<LoginResponse>('http://localhost:3000/users/login', { email, password });
        this.setUserAndToken(response.data.user, response.data.token);
        console.log('User logged in and token stored');
      } catch (error) {
        this.handleError(error, 'An error occurred during login');
      } finally {
        this.loading = false;
      }
    },

    setUserAndToken(user: IUser, token: string) {
      this.user = user;
      this.token = token;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    logoutUser() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      console.log('User logged out');
    },

    checkAuth() {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const decodedToken = jwtDecode(storedToken) as JwtPayload;
          
          if (Date.now() >= decodedToken.exp * 1000) {
            // Token expiré
            this.logoutUser();
            return false;
          }
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            this.setUserAndToken(JSON.parse(storedUser), storedToken);
            console.log('Stored user and valid token found');
            return true;
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          this.logoutUser();
        }
      }
      console.log('No valid stored session found');
      return false;
    },

    async refreshToken() {
      try {
        const response = await axios.post<{ token: string }>('http://localhost:3000/users/refresh-token');
        this.setUserAndToken(this.user!, response.data.token);
        console.log('Token refreshed');
      } catch (error) {
        this.handleError(error, 'Error refreshing token');
        this.logoutUser();
      }
    },

    handleError(error: unknown, defaultMessage: string) {
      if (axios.isAxiosError(error)) {
        this.error = error.response?.data?.error || defaultMessage;
      } else {
        this.error = defaultMessage;
      }
      console.error('Error:', this.error);
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
      return !!this.user && !!this.token;
    },
  },
});