<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/UserStore'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Logo from '@/components/Logo.vue'
import SettingButton from '@/components/SettingButton.vue'
import Footer from '@/components/Footer.vue'

const userStore = useUserStore()
const router = useRouter()
const { t } = useI18n()

const code = ref('')
const errorMessage = ref('')
const twoFactorCode = ref('')

// Vérifiez le 2FA
const verifyTwoFA = async () => {
  const user = userStore.user
  const tempToken = userStore.tempToken
  const twoFactorCode = userStore.twoFactorCode

  console.log('user', userStore.user)
  console.log('twoFactorCode', twoFactorCode)
  console.log('usertoken hhhh', tempToken) // Récupération du tempToken
  try {
    await userStore.verifyTwoFA(tempToken, twoFactorCode)
    router.push('/')
    console.log('userrrr', user)
    await userStore.checkAuth()
  } catch (error) {
    console.error('Erreur lors de la vérification 2FA:', error)
    // Affiche l'erreur à l'utilisateur, par exemple en utilisant une alerte
  }
}
</script>

<template>
  <div class="app-container">
    <div class="header">
      <Logo class="logo" />
      <SettingButton class="settings" />
    </div>

    <div class="main-content">
      <div class="two-fa-container">
        <h2>{{ t('twoFA.title') }}</h2>
        <p>{{ t('twoFA.instruction') }}</p>
        <form @submit.prevent="verifyTwoFA">
          <!-- Appel de la méthode de vérification -->
          <input v-model="code" type="text" :placeholder="t('twoFA.codePlaceholder')" required />
          <button type="submit" class="submit-button">{{ t('twoFA.submit') }}</button>
        </form>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <!-- Affichage du message d'erreur -->
      </div>
    </div>

    <Footer class="footer" />
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  margin-left: 10px;
}

.settings {
  margin-right: 20px;
}

.two-fa-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.two-fa-form {
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
}

input {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
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

.error-message {
  margin-top: 20px;
  color: #d9534f;
  font-size: 14px;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}

.footer {
  margin-top: auto;
}
</style>
