<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/UserStore';
import { useI18n } from 'vue-i18n';
import axios from 'axios';

const store = useUserStore();
const router = useRouter();
const { t } = useI18n();
const showDropdown = ref(false);
const imageError = ref(false);

// Intercepteur pour gérer l'expiration du token
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      if (error.response.data.error === 'Token expired') {
        console.log('Token expired, attempting to refresh');
        try {
          await store.refreshToken();
          // Retry the original request
          return axios(error.config);
        } catch (refreshError) {
          console.log('Token refresh failed, logging out');
          store.logoutUser();
          router.push('/login');
        }
      } else {
        store.logoutUser();
        router.push('/login');
      }
    }
    return Promise.reject(error);
  }
);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const goToLogin = () => {
  router.push('/login');
  showDropdown.value = false;
};

const goToProfile = () => {
  router.push('/profile');
  showDropdown.value = false;
};


const logout = () => {
  store.logoutUser();
  router.push('/');
  showDropdown.value = false;
};

const isAuthenticated = computed(() => store.isAuthenticated);

const userInitial = computed(() => {
  return store.user?.name?.charAt(0).toUpperCase() ?? '';
});

const hasProfilePhoto = computed(() => {
  return !!store.user?.UserPhoto;
});

// URL fixe du serveur backend
const BACKEND_URL = 'http://localhost:3000';

const profilePhotoUrl = computed(() => {
  if (!store.user?.UserPhoto) return '';
  
  // Assurez-vous que le chemin ne contient pas de slash au début
  const photoPath = store.user.UserPhoto.startsWith('/') 
    ? store.user.UserPhoto.slice(1) 
    : store.user.UserPhoto;
  
  const fullUrl = `${BACKEND_URL}/${photoPath}`;
  console.log('URL complète de la photo de profil:', fullUrl);
  return fullUrl;
});

const handleImageError = () => {
  imageError.value = true;
  console.error('Failed to load profile image');
};

watch(() => store.user, () => {
  imageError.value = false;
}, { deep: true });

onMounted(() => {
  store.checkAuth();
});
</script>

<template>
  <div class="profile-dropdown">
    <div class="profile-button" @click="toggleDropdown">
      <img
        v-if="hasProfilePhoto && !imageError"
        :src="profilePhotoUrl"
        alt="Profile Photo"
        class="profile-photo"
        @error="handleImageError"
      >
      <div v-else-if="isAuthenticated" class="profile-initial">{{ userInitial }}</div>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0m0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5z"
          clip-rule="evenodd"
        />
      </svg>
    </div>

    <div v-if="showDropdown" class="dropdown-menu">
      <template v-if="isAuthenticated">
        <div @click="goToProfile">{{ t('profile') }}</div>
        <div @click="logout">{{ t('logout') }}</div>
      </template>
      <template v-else>
        <div @click="goToLogin">{{ t('login') }}</div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.profile-button {
  width: 60px;
  height: 60px;
  background-color: #00bcd4;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.profile-button:hover {
  background-color: #77d2de;
}

.profile-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-initial {
  font-size: 24px;
  color: white;
  font-weight: bold;
}

svg {
  color: white;
}

.profile-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 70px;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 160px;
}

.dropdown-menu div {
  padding: 10px;
  cursor: pointer;
}

.dropdown-menu div:hover {
  background-color: #f5f5f5;
}
</style>