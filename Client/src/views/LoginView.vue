<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/UserStore';

const store = useUserStore();
const email = ref('');
const password = ref('');
const router = useRouter();

// Fonction de login
const login = async () => {
  await store.loginUser(email.value, password.value);

  if (store.isAuthenticated) {
    console.log('Login successful, redirecting to home');
    router.push('/');
  } else {
    console.log('Login failed');
  }
};

// Fonction pour rediriger vers la page de création de compte
const goToCreateAccount = () => {
  router.push('/create-account');
};
</script>

<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <label for="email">Email:</label>
        <input id="email" v-model="email" type="email" required placeholder="Enter your email" />
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input id="password" v-model="password" type="password" required placeholder="Enter your password" />
      </div>

      <button type="submit" class="submit-button">Login</button>
    </form>

    <div v-if="store.loading" class="loading-message">Logging in...</div>
    <div v-if="store.error" class="error-message">{{ store.error }}</div>

    <!-- Bouton pour créer un compte -->
    <button class="create-account-button" @click="goToCreateAccount">
      Créer un compte
    </button>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: auto;
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

.login-form {
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

.create-account-button {
  margin-top: 20px;
  background-color: transparent;
  border: 2px solid #00bcd4;
  color: #00bcd4;
  padding: 10px;
  width: 100%;
  border-radius: 4px;
  cursor: pointer;
}

.create-account-button:hover {
  background-color: #00bcd4;
  color: white;
}
</style>
