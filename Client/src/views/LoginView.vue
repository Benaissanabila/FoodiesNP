<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/UserStore';

const store = useUserStore();
const email = ref('');
const password = ref('');

const login = async () => {
  await store.loginUser(email.value, password.value);
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
  </div>
</template>

<style scoped>
.login {
  max-width: 400px;
  margin: auto;
}
</style>
