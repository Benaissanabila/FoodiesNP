<template>
    <div class="hamburger-menu">
      <button class="hamburger-icon" @click="toggleMenu">
        ☰ <!-- Icône hamburger -->
      </button>
      <div v-if="isMenuOpen" class="menu">
        <ChatButton />
        <SettingButton />
        <ProfileButton />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import ChatButton from './ChatButton.vue';
  import SettingButton from './SettingButton.vue';
  import ProfileButton from './ProfileButton.vue';
  
  // Définition de l'état pour savoir si le menu est ouvert ou fermé
  const isMenuOpen = ref(false);
  
  // Fonction pour basculer l'état du menu
  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };
  </script>
  
  <style scoped>
  .hamburger-icon {
  font-size: 2em;
  cursor: pointer;
  background: #00bcd4; /* Bleu vif pour un look moderne */
  border: none;
  color: white; /* Couleur du texte blanche pour le contraste */
  padding: 10px; /* Ajouter un peu de padding pour une meilleure accessibilité */
  border-radius: 5px; /* Coins arrondis pour un aspect plus doux */
  transition: background-color 0.3s ease; /* Animation douce pour les survols */
}

.hamburger-icon:hover {
  background: #77d2de; /* Couleur plus foncée au survol */
}

.menu {
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa; /* Gris très clair pour un look propre et moderne */
  border: 1px solid #dee2e6; /* Bordure gris clair pour la structure */
  padding: 15px; /* Padding plus généreux pour une meilleure ergonomie */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Légère ombre pour un effet de profondeur */
  border-radius: 8px; /* Coins arrondis pour un aspect plus soigné */
}

.menu button {
  background-color: #007bff; /* Bleu pour les boutons */
  color: white; /* Texte en blanc */
  border: none;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.menu button:hover {
  background-color: #0056b3; /* Couleur plus foncée au survol */
}

  </style>
  