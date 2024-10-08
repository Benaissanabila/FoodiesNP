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
  width: 100%;
  padding: 10px 0;
  border-top: 1px solid black;
  margin-top: auto; /* Pousse le footer vers le bas */
}

.copyright {
  text-align: center;
  font-size: 0.9rem;
  color: black;
  margin: 0;
}
</style>