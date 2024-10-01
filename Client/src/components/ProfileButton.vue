<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const handleClick = () => {
  router.push('/login');
};
</script>

<template>
  <div class="profile-button" @click="handleClick">
    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        fill-rule="evenodd"
        d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0m0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5z"
        clip-rule="evenodd"
      />
    </svg>
  </div>
</template>

<style scoped>
.profile-button {
  width: 60px;
  height: 60px;
  background-color: #00bcd4;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.profile-button:hover {
  background-color: #77d2de;
}
svg {
  color: white;
}
</style>
