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

interface LoginResult {
  needsTwoFA: boolean;
  success: boolean;
  error?: string;
}

export const useUserStore = defineStore('UserStore', {
  state: () => ({
    user: null as IUser | null,
    token: null as string | null,
    tempToken: null as string | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    // Authentication actions
    async createUser(formData: FormData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post<LoginResponse>('http://localhost:3000/users', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        this.setUserAndToken(response.data.user, response.data.token);
        console.log('User created and token stored');
      } catch (error) {
        this.handleError(error, 'Une erreur est survenue lors de la création de l\'utilisateur');
      } finally {
        this.loading = false;
      }
    },

    async loginUser(email: string, password: string): Promise<LoginResult> {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('http://localhost:3000/users/login', { email, password });
        if (response.data.message === 'Veuillez vérifier votre email pour le code 2FA') {
          this.tempToken = response.data.tempToken;
          return { needsTwoFA: true, success: true };
        }else {
          throw new Error('Unexpected response from server');
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data?.error === 'Failed to send 2FA code') {
          this.error = 'Unable to send 2FA code. Please try again later.';
        } else {
          this.handleError(error, 'An error occurred during login');
        }
        return { needsTwoFA: false, success: false, error: this.error || 'Unknown error' };
      } finally {
        this.loading = false;
      }
    },
    async verify2FA(code: string) {
      this.loading = true;
      this.error = null;
      try {
        console.log('Sending 2FA verification:', code, this.tempToken);
        const response = await axios.post('http://localhost:3000/users/verify2fa', { 
          code, 
          tempToken: this.tempToken 
        });
        console.log('2FA verification response:', response.data);
        this.setUserAndToken(response.data.user, response.data.token);
        this.tempToken = null;
      } catch (error) {
        console.error('2FA verification error:', error);
        this.handleError(error, 'Invalid 2FA code');
        throw error;
      } finally {
        this.loading = false;
      }
    },


    logoutUser() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      console.log('User logged out');
    },

    // Token management
    checkAuth() {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const decodedToken = jwtDecode(storedToken) as JwtPayload;
          if (Date.now() >= decodedToken.exp * 1000) {
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

    // User data management
    async updateUser(updatedUser: Partial<IUser>) {
      try {
        if (updatedUser.DOB) {
          updatedUser.DOB = new Date(updatedUser.DOB);
        }
        const response = await axios.put(`http://localhost:3000/users/${this.user?._id}`, updatedUser);
        this.user = response.data;
        localStorage.setItem('user', JSON.stringify(this.user));
      } catch (error) {
        this.handleError(error, 'Erreur lors de la mise à jour du profil');
        throw error;
      }
    },

    async deleteUser() {
      try {
        await axios.delete(`http://localhost:3000/users/${this.user?._id}`);
        this.logoutUser();
      } catch (error) {
        this.handleError(error, 'Erreur lors de la suppression du compte');
        throw error;
      }
    },

    async fetchUserById(userId: string) {
      try {
        const response = await axios.get(`http://localhost:3000/users/${userId}`);
        return response.data;
      } catch (error) {
        this.handleError(error, 'Erreur lors de la récupération de l\'utilisateur');
        throw error;
      }
    },

    async updateProfilePhoto(file: File) {
      try {
        const formData = new FormData();
        formData.append('UserPhoto', file);
        const response = await axios.post(`http://localhost:3000/users/${this.user?._id}/photo`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (this.user && response.data.UserPhoto) {
          this.user = { ...this.user, UserPhoto: response.data.UserPhoto };
          localStorage.setItem('user', JSON.stringify(this.user));
          console.log('Photo de profil mise à jour:', this.user.UserPhoto);
        }
      } catch (error) {
        this.handleError(error, 'Erreur lors de la mise à jour de la photo de profil');
        throw error;
      }
    },

    // Utility methods
    setUserAndToken(user: IUser, token: string) {
      this.user = user;
      this.token = token;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    handleError(error: unknown, defaultMessage: string) {
      if (axios.isAxiosError(error)) {
        this.error = error.response?.data?.error || defaultMessage;
      } else {
        this.error = defaultMessage;
      }
      console.error('Error:', this.error);
    },
  },

  getters: {
    isAuthenticated(): boolean {
      return !!this.user && !!this.token;
    },
    currentUser(): IUser | null {
      return this.user; // Getter pour récupérer l'utilisateur actuel
    },
  },
});