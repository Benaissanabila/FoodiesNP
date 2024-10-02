<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Importer le router pour la redirection
import { useUserStore } from '@/stores/UserStore';

const store = useUserStore();
const router = useRouter(); // Créer une instance du router

const name = ref('');
const email = ref('');
const password = ref('');
const dob = ref('');
const profilePicture = ref<File | null>(null); // Pour stocker le fichier sélectionné

// Gérer la sélection de l'image
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    profilePicture.value = target.files[0];
  }
};

// Fonction pour créer un compte
const createAccount = async () => {
  // Créer un FormData pour envoyer les données avec l'image
  const formData = new FormData();
  formData.append('name', name.value);
  formData.append('email', email.value);
  formData.append('password', password.value);
  formData.append('DOB', dob.value);
  if (profilePicture.value) {
    formData.append('UserPhoto', profilePicture.value); // Ajouter l'image
  }

  await store.createUser(formData); // Envoyer le FormData au lieu d'un objet

  // Si la création du compte a réussi, rediriger vers la page de login
  if (!store.error) {
    router.push('/login'); // Rediriger vers la page de login
  }
};
</script>

<template>
  <div class="create-account-container">
    <h2>Create Account</h2>
    <form @submit.prevent="createAccount" class="create-account-form" enctype="multipart/form-data">
      <div class="form-group">
        <label for="name">Name:</label>
        <input id="name" v-model="name" type="text" required placeholder="Enter your name" />
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input id="email" v-model="email" type="email" required placeholder="Enter your email" />
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input id="password" v-model="password" type="password" required placeholder="Enter your password" />
      </div>

      <div class="form-group">
        <label for="dob">Date of Birth:</label>
        <input id="dob" v-model="dob" type="date" required />
      </div>

      <div class="form-group">
        <label for="profilePicture">Profile Picture:</label>
        <input id="profilePicture" type="file" @change="handleFileUpload" accept="image/*" />
      </div>

      <button type="submit" class="submit-button">Create Account</button>
    </form>

    <div v-if="store.loading" class="loading-message">Creating account...</div>
    <div v-if="store.error" class="error-message">{{ store.error }}</div> <!-- Message d'erreur -->
  </div>
</template>

<style scoped>
.create-account-container {
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
