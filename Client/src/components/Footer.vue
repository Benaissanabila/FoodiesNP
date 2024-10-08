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

<style>
/* Ces styles doivent être globaux pour affecter toute la structure de la page */
html {
  height: 100%;
}

body {
  min-height: 100%;
  display: grid;
  grid-template-rows: 1fr auto;
}

#app {
  min-height: 100vh;
  display: grid;
  grid-template-rows: 1fr auto;
}

.footer {
  grid-row-start: 2;
  grid-row-end: 3;
  width: 100%;
  padding: 10px 0;
  border-top: 1px solid black;
  background-color: white;
}

.copyright {
  text-align: center;
  font-size: 0.9rem;
  color: black;
  margin: 0;
}
</style>