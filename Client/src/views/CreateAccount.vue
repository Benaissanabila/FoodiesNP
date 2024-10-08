<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/UserStore';
import { useI18n } from 'vue-i18n'; // Importer vue-i18n
import SettingButton from '@/components/SettingButton.vue';
import Logo from '@/components/Logo.vue'; 
import Footer from '@/components/Footer.vue';

const store = useUserStore();
const router = useRouter();
const { t } = useI18n(); // Utiliser la fonction de traduction

const name = ref('');
const email = ref('');
const password = ref('');
const dob = ref('');
const profilePicture = ref<File | null>(null);

// Gérer la sélection de l'image
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    profilePicture.value = target.files[0];
  }
};

// Fonction pour créer un compte
const createAccount = async () => {
  const formData = new FormData();
  formData.append('name', name.value);
  formData.append('email', email.value);
  formData.append('password', password.value);
  formData.append('DOB', dob.value);
  if (profilePicture.value) {
    formData.append('UserPhoto', profilePicture.value);
  }

  await store.createUser(formData);

  if (!store.error) {
    router.push('/login');
  }
};
</script>

<template>
  <div class="header">
    <Logo class="logo" />
    <SettingButton class="settings" />
  </div>

  <div class="create-account-container">
    <h2>{{ t('createAccount') }}</h2>
    <form @submit.prevent="createAccount" class="create-account-form" enctype="multipart/form-data">
      <div class="form-group">
        <label for="name">{{ t('name') }}:</label>
        <input id="name" v-model="name" type="text" required :placeholder="t('enterName')" />
      </div>

      <div class="form-group">
        <label for="email">{{ t('email') }}:</label>
        <input id="email" v-model="email" type="email" required :placeholder="t('enterEmail')" />
      </div>

      <div class="form-group">
        <label for="password">{{ t('password') }}:</label>
        <input id="password" v-model="password" type="password" required :placeholder="t('enterPassword')" />
      </div>

      <div class="form-group">
        <label for="dob">{{ t('dob') }}:</label>
        <input id="dob" v-model="dob" type="date" required />
      </div>

      <div class="form-group">
        <label for="profilePicture">{{ t('profilePicture') }}:</label>
        <input id="profilePicture" type="file" @change="handleFileUpload" accept="image/*"  />
      </div>

      <button type="submit" class="submit-button">{{ t('createAccount') }}</button>
    </form>

    <div v-if="store.loading" class="loading-message">{{ t('creatingAccount') }}</div>
    <div v-if="store.error" class="error-message">{{ store.error }}</div>
  </div>

  <Footer />
</template>

<style scoped>
/* Container for the logo and settings button */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  position: absolute;
  width: 100%;
  top: 0;
}

/* Style for the logo - aligned to the left */
.logo {
  position: absolute;
  top: 10px;
  left: 10px;
}

/* Style for the settings button - aligned to the right */
.settings {
  position: absolute;
  top: 10px;
  right: 66px;
}

.create-account-container {
  max-width: 400px;
  margin: 80px auto 0; /* Adjusted margin to account for header */
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

.create-account-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  font-size: 14px;
  margin-bottom: 8px;
  color: #555;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f5f5f5;
}

input:focus {
  border-color: #00bcd4;
  outline: none;
  background-color: #fff;
}

.submit-button {
  background-color: #00bcd4;
  border: none;
  color: white;
  padding: 12px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
}

.submit-button:hover {
  background-color: #009bb7;
}

.loading-message,
.error-message {
  margin-top: 20px;
  color: #d9534f;
  font-size: 14px;
}
</style>
