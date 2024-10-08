<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRestaurantStore } from '@/stores/RestaurantStore'
import { useRouter } from 'vue-router'
import Footer from '@/components/Footer.vue'
import SettingButton from '@/components/SettingButton.vue'
import Logo from '@/components/Logo.vue'

const { t } = useI18n()
const restaurantStore = useRestaurantStore()
const router = useRouter()

type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

interface DaySchedule {
  open: string
  close: string
}

type Schedule = {
  [K in DayOfWeek]: DaySchedule
}

interface Restaurant {
  name: string
  streetAddress: string
  city: string
  stateProvince: string
  country: string
  phoneNumber: string
  cuisineType: string
  schedule: Schedule
  RestoPhoto: File | null
}

const restaurant = reactive<Restaurant>({
  name: '',
  streetAddress: '',
  city: '',
  stateProvince: '',
  country: '',
  phoneNumber: '',
  cuisineType: '',
  schedule: {
    monday: { open: '', close: '' },
    tuesday: { open: '', close: '' },
    wednesday: { open: '', close: '' },
    thursday: { open: '', close: '' },
    friday: { open: '', close: '' },
    saturday: { open: '', close: '' },
    sunday: { open: '', close: '' }
  },
  RestoPhoto: null
})

const previewImage = ref('')
const photoInput = ref<HTMLInputElement | null>(null)

const cuisineTypes = [
  'Italien',
  'Français',
  'Japonais',
  'Chinois',
  'Mexicain',
  'Indien',
  'Thaïlandais',
  'Américain'
]

const days: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
]

function triggerPhotoUpload() {
  photoInput.value?.click()
}

function handlePhotoChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    restaurant.RestoPhoto = file
    previewImage.value = URL.createObjectURL(file)
  }
}

function uploadMenu() {
  console.log('Téléversement du menu')
}

async function createRestaurant() {
  try {
    await restaurantStore.createRestaurant(restaurant)
    router.push('/my-restaurants')
  } catch (error) {
    console.error('Erreur lors de la création du restaurant:', error)
  }
}
</script>

<template>
  <div class="page-container">
    <header class="header">
      <Logo class="logo" />
      <SettingButton class="settings" />
    </header>
    <div class="content-wrap">
      <div class="create-restaurant-container">
        <h1>{{ $t('createMyRestaurant.title') }}</h1>

        <div class="photo-container">
          <img
            :src="previewImage || '/placeholder-restaurant.png'"
            alt="Restaurant Photo"
            class="restaurant-photo"
          />
          <button @click="triggerPhotoUpload" class="btn btn-secondary">
            {{ $t('createMyRestaurant.changePhoto') }}
          </button>
          <input
            type="file"
            ref="photoInput"
            @change="handlePhotoChange"
            accept="image/*"
            style="display: none"
          />
        </div>

        <form @submit.prevent="createRestaurant">
          <div class="form-group">
            <input
              v-model="restaurant.name"
              :placeholder="$t('createMyRestaurant.namePlaceholder')"
              required
            />
          </div>

          <div class="form-group address-group">
            <input
              class="street-address"
              v-model="restaurant.streetAddress"
              :placeholder="$t('createMyRestaurant.streetAddressPlaceholder')"
              required
            />
            <input
              v-model="restaurant.city"
              :placeholder="$t('createMyRestaurant.cityPlaceholder')"
              required
            />
            <input
              v-model="restaurant.stateProvince"
              :placeholder="$t('createMyRestaurant.stateProvincePlaceholder')"
              required
            />
            <input
              v-model="restaurant.country"
              :placeholder="$t('createMyRestaurant.countryPlaceholder')"
              required
            />
          </div>

          <div class="form-group">
            <input
              v-model="restaurant.phoneNumber"
              :placeholder="$t('createMyRestaurant.phonePlaceholder')"
              required
            />
          </div>

          <div class="form-group">
            <select v-model="restaurant.cuisineType" required>
              <option value="" disabled selected>
                {{ $t('createMyRestaurant.cuisineTypePlaceholder') }}
              </option>
              <option v-for="type in cuisineTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>

          <div class="schedule-container">
            <h3>{{ $t('createMyRestaurant.scheduleTitle') }}</h3>
            <div v-for="day in days" :key="day" class="schedule-day">
              <label>{{ $t(`createMyRestaurant.days.${day}`) }}</label>
              <div class="schedule-inputs">
                <input
                  v-model="restaurant.schedule[day].open"
                  type="time"
                  :placeholder="$t('createMyRestaurant.openTime')"
                  required
                />
                <input
                  v-model="restaurant.schedule[day].close"
                  type="time"
                  :placeholder="$t('createMyRestaurant.closeTime')"
                  required
                />
              </div>
            </div>
          </div>

          <button type="button" @click="uploadMenu" class="btn btn-secondary">
            {{ $t('createMyRestaurant.uploadMenu') }}
          </button>

          <button type="submit" class="btn btn-primary">
            {{ $t('createMyRestaurant.submit') }}
          </button>
        </form>
      </div>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.create-restaurant-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
}

.photo-container {
  text-align: center;
  margin-bottom: 20px;
}

.restaurant-photo {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
}

.form-group {
  margin-bottom: 15px;
}

input,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.btn-primary {
  background-color: #00bcd4;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
}

.logo {
  height: 40px;
}

.schedule-container {
  margin-top: 20px;
}

.schedule-day {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.schedule-inputs {
  display: flex;
  gap: 10px;
}

.schedule-inputs input {
  width: 120px;
}

.form-group {
  margin-bottom: 15px;
}

.address-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  width: 100%; /* Changé de 120% à 100% pour éviter le débordement */
}

.address-group input {
  flex: 1 1 120px; /* flex-grow: 1, flex-shrink: 1, flex-basis: 120px */
  min-width: 120px;
}

.street-address {
  flex: 2 1 240px; /* flex-grow: 2, flex-shrink: 1, flex-basis: 240px */
  min-width: 20px; /* Augmente la largeur minimale */
}

input,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
