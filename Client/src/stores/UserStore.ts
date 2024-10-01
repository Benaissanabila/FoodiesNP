import { defineStore } from 'pinia';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

interface User {
  name: string;
  email: string;
  password: string;
  UserPhoto?: string;
  DOB: string;
}

interface UserStoreState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useUserStore = defineStore('UserStore', {
  state: (): UserStoreState => ({
    user: null,
    loading: false,
    error: null,
  }),

  actions: {
    async loginUser(email: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('/api/users/login', { email, password });
        this.user = response.data;
        this.loading = false;
      } catch (error: any) {
        this.error = error.response ? error.response.data.error : 'Error during login';
        this.loading = false;
      }
      if (this.user) {
        router.push('/profile');
      }
    },

    async createUser(newUser: User) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('/api/users', newUser);
        this.user = response.data;
        this.loading = false;
      } catch (error: any) {
        this.error = error.response ? error.response.data.error : 'Error creating account';
        this.loading = false;
      }
      if (this.user) {
        router.push('/profile');
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
