<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const isLanguageSelectorVisible = ref(false)
const isSettingsVisible = ref(false)

const toggleSettings = () => {
  isSettingsVisible.value = !isSettingsVisible.value
  isLanguageSelectorVisible.value = false
}

const toggleLanguageSelector = () => {
  isLanguageSelectorVisible.value = !isLanguageSelectorVisible.value
}

const changeLanguage = (lang: 'en' | 'fr') => {
  locale.value = lang
  console.log(`Language changed to: ${lang}`)
}
</script>

<template>
  <div class="settings-container">
    <!-- Bouton des réglages -->
    <div class="setting-button" @click="toggleSettings">
      <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 20 20">
        <path
          fill="currentColor"
          d="M11.078 0c.294 0 .557.183.656.457l.706 1.957q.379.094.654.192q.3.107.78.33l1.644-.87a.7.7 0 0 1 .832.131l1.446 1.495c.192.199.246.49.138.744l-.771 1.807q.191.352.308.604q.126.273.312.76l1.797.77c.27.115.437.385.419.674l-.132 2.075a.69.69 0 0 1-.46.605l-1.702.605q-.073.352-.154.606a9 9 0 0 1-.298.774l.855 1.89a.68.68 0 0 1-.168.793l-1.626 1.452a.7.7 0 0 1-.796.096l-1.676-.888a7 7 0 0 1-.81.367l-.732.274l-.65 1.8a.7.7 0 0 1-.64.457L9.11 20a.7.7 0 0 1-.669-.447l-.766-2.027a15 15 0 0 1-.776-.29a10 10 0 0 1-.618-.293l-1.9.812a.7.7 0 0 1-.755-.133L2.22 16.303a.68.68 0 0 1-.155-.783l.817-1.78a10 10 0 0 1-.302-.644a14 14 0 0 1-.3-.811L.49 11.74a.69.69 0 0 1-.49-.683l.07-1.921a.69.69 0 0 1 .392-.594L2.34 7.64q.13-.478.23-.748a9 9 0 0 1 .314-.712L2.07 4.46a.68.68 0 0 1 .15-.79l1.404-1.326a.7.7 0 0 1 .75-.138l1.898.784q.314-.209.572-.344q.307-.162.824-.346l.66-1.841A.7.7 0 0 1 8.984 0zm-1.054 7.019c-1.667 0-3.018 1.335-3.018 2.983s1.351 2.984 3.018 2.984s3.017-1.336 3.017-2.984s-1.35-2.983-3.017-2.983"
        />
      </svg>
    </div>

    <!-- Section des réglages -->
    <div v-if="isSettingsVisible" class="settings-section">
      <button class="language-button" @click="toggleLanguageSelector">
        <img src="../assets/image/langage.svg" alt="Language Icon" class="language-icon" />
        {{ t('selectLanguage') }}
      </button>

      <!-- Sélection de la langue -->
      <div v-if="isLanguageSelectorVisible" class="language-selector">
        <button @click="changeLanguage('en')" class="language-option">
          <img src="../assets/image/flagEn.svg" alt="English Flag" class="language-icon" />
          {{ t('english') }}
        </button>
        <button @click="changeLanguage('fr')" class="language-option">
          <img src="../assets/image/flagFr.svg" alt="French Flag" class="language-icon" />
          {{ t('french') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-container {
  position: relative;
}

.setting-button {
  width: 60px;
  height: 60px;
  background-color: #00bcd4; /* Couleur du bouton */
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  
}

.setting-button:hover {
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  background-color: #77d2de;
}

.settings-section {
  position: absolute; /* Positionner la section des réglages */
  top: 70px; /* Positionne la section en dessous du bouton */
  left: 50%; /* Centre horizontalement par rapport au bouton */
  transform: translateX(-50%); /* Ajuste pour un parfait centrage horizontal */
  border-radius: 4px; /* Coins arrondis */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  padding: 10px;
  z-index: 10;
  width: 150px; /* Largeur uniforme pour la section */
}

.language-button {
  display: flex; /* Utiliser flex pour aligner l'icône et le texte */
  align-items: center; /* Centre verticalement */
  cursor: pointer; /* Curseur de pointeur pour indiquer que c'est cliquable */
  padding: 5px; /* Ajout d'un peu d'espace autour */
  border: none; /* Pas de bordure */
  color: #000000; /* Couleur du texte */
  width: 150px; /* Largeur fixe pour tous les boutons */
  border-radius: 5px;
}

.language-button:hover {
  color: #027e8f; /* Couleur de survol du texte */
}

.language-icon {
  width: 20px; /* Largeur de l'icône */
  height: 20px; /* Hauteur de l'icône */
  margin-right: 8px; /* Espace entre l'icône et le texte */
}

.language-selector {
  display: flex;
  flex-direction: column; /* Aligne les boutons de langue verticalement */
}

.language-option {
  display: flex; /* Utiliser flex pour aligner l'icône et le texte */
  align-items: center; /* Centre verticalement */
  cursor: pointer; /* Curseur de pointeur pour indiquer que c'est cliquable */
  padding: 5px; /* Ajout d'un peu d'espace autour */
  border: none; /* Pas de bordure */
  width: 150px; /* Largeur uniforme pour les options de langue */
  border-radius: 5px;
}

.language-selector button {
  margin: 5px 0; /* Espace entre les boutons */
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #00bcd4;
}

.language-selector button:hover {
  background-color: #77d2de; /* Couleur de survol des boutons */
}

svg {
  color: white;
}
</style>
