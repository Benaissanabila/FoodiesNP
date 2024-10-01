<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/UserStore';

const store = useUserStore();
const name = ref('');
const email = ref('');
const password = ref('');
const dob = ref('');

const createAccount = async () => {
  await store.createUser({
    name: name.value,
    email: email.value,
    password: password.value,
    DOB: dob.value,
  });
};
</script>

<template>
  <div class="create-account">
    <h2>Create Account</h2>
    <form @submit.prevent="createAccount">
      <label>Name:</label>
      <input v-model="name" type="text" required />

      <label>Email:</label>
      <input v-model="email" type="email" required />

      <label>Password:</label>
      <input v-model="password" type="password" required />

      <label>Date of Birth:</label>
      <input v-model="dob" type="date" required />

      <button type="submit">Create Account</button>
    </form>

    <div v-if="store.loading">Creating account...</div>
    <div v-if="store.error">{{ store.error }}</div>
  </div>
</template>

<style scoped>
.create-account {
  max-width: 400px;
  margin: auto;
}
</style>
