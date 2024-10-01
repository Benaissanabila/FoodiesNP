<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Importer le router
import { useUserStore } from '@/stores/UserStore';

const store = useUserStore();
const email = ref('');
const password = ref('');
const router = useRouter(); // Créer une instance du router

// Fonction de login
const login = async () => {
  await store.loginUser(email.value, password.value);
};

// Fonction pour rediriger vers la page de création de compte
const goToCreateAccount = () => {
  router.push('/create-account'); // Rediriger vers la page de création de compte
};
</script>

<template>
  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <label>Email:</label>
      <input v-model="email" type="email" required />

      <label>Password:</label>
      <input v-model="password" type="password" required />

      <button type="submit">Login</button>
    </form>

    <div v-if="store.loading">Logging in...</div>
    <div v-if="store.error">{{ store.error }}</div>

    <!-- Bouton pour créer un compte -->
    <button class="create-account-button" @click="goToCreateAccount">
      Créer un compte
    </button>
  </div>
</template>

<style scoped>
.login {
  max-width: 400px;
  margin: auto;
}

.create-account-button {
  margin-top: 20px;
  background-color: #00bcd4;
  border: none;
  color: white;
  padding: 10px;
  width: 100%;
  border-radius: 4px;
  cursor: pointer;
}

.create-account-button:hover {
  background-color: #77d2de;
}
</style>
