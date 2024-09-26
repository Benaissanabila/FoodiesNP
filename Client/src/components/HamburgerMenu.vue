<script setup lang="ts">
import { ref } from 'vue';
import ChatButton from './ChatButton.vue';
import SettingButton from './SettingButton.vue';
import ProfileButton from './ProfileButton.vue';

const isMenuOpen = ref(false);

// Fonction pour ouvrir/fermer le menu
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>



<template>
  <div>
    <!-- Icône hamburger ou "X" selon l'état du menu -->
    <button v-if="!isMenuOpen" @click="toggleMenu" class="hamburger-icon">
      &#9776; <!-- Icône hamburger -->
    </button>
    <button v-else @click="toggleMenu" class="close-icon">
      &#10005; <!-- Icône "X" pour fermer -->
    </button>

    <!-- Menu qui défile -->
    <div :class="['menu', { open: isMenuOpen }]">
      <ChatButton />
      <SettingButton />
      <ProfileButton />
    </div>
  </div>
</template>



  
  <style scoped>
 .hamburger-icon {
  font-size: 2em;
  cursor: pointer;
  background: #00bcd4;
  border: none;
  color: white;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  position: fixed;
  top: 29px;
  right: 30px;
  z-index: 1000;
}

.hamburger-icon:hover {
  background: #77d2de;
}
/* Ajout d'espacement entre les composants */
.menu > * {
  margin: 10px ; 
}
.menu {
  position: fixed;
  top: 20px;
  right: 10px;
border-radius: 10px;
background-color: #77d2de67;
  width: 90px; /* Ajustement de la largeur */
  backdrop-filter: blur(5px);
  border-left: 1px solid #dee2e6;
  padding: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateX(130%); 
  transition: transform 1s ease-in-out, opacity 1s ease-in-out; 
  z-index: 999;
}

.menu.open {
  transform: translateX(0); /* Défile de droite à gauche quand ouvert */

}
.close-icon {
  font-size: 1.5em;
  cursor: pointer;
  border: none;
  color: rgb(76, 76, 76);
  padding: 10px;
  border-radius: 5px;
  background-color: transparent;
  position: fixed;
  top: 20px;
  right: 10px;
  z-index: 1001; 
}
  </style>
  