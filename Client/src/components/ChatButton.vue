<script setup lang="ts">
const handleClick = () => {
  alert('Chat button clicked!')
}
</script>

<template>
  <div class="chat-button" @click="handleClick">
    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 20 20">
      <path
        fill="currentColor"
        d="M5.8 12.2V6H2C.9 6 0 6.9 0 8v6c0 1.1.9 2 2 2h1v3l3-3h5c1.1 0 2-.9 2-2v-1.82a1 1 0 0 1-.2.021h-7zM18 1H9c-1.1 0-2 .9-2 2v8h7l3 3v-3h1c1.1 0 2-.899 2-2V3c0-1.1-.9-2-2-2"
      />
    </svg>
  </div>
</template>

<style scoped>
.chat-button {
  position: relative;
  width: 60px;
  height: 60px;
  background-color: #00bcd4; /* Button color */
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.chat-button:hover {
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  background-color: #77d2de;
}
svg{
    color: white;
  }
</style>
