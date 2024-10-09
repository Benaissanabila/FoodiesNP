<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const currentYear = ref(new Date().getFullYear())

onMounted(() => {
  setInterval(() => {
    currentYear.value = new Date().getFullYear()
  }, 60000)
})
</script>

<template>
  <footer class="footer">
    <p class="copyright">{{ t('footer.copyright', { year: currentYear }) }}</p>
  </footer>
</template>

<style scoped>

  .footer {
  height: 50px; /* Hauteur fixe */
  width: 100%; /* Largeur maximale */
  display: flex;
  justify-content: center; /* Centrer le contenu horizontalement */
  align-items: center; /* Centrer le contenu verticalement */
  color: white; /* Couleur du texte */
  border-top: 1px solid black;
}
  
  

.copyright {
  text-align: center;
  font-size: 0.9rem;
  color: black;
  margin: 0;
}
</style>