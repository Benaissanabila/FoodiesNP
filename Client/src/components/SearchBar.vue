<script setup lang='ts'> 
import { ref, defineEmits } from 'vue';

const emit = defineEmits<{
  (e: 'update:searchQuery', value: string): void;
}>();

const searchQuery = ref('');

const updateSearch = () => {
  emit('update:searchQuery', searchQuery.value);
};

</script>

<template>
    <div>
        <input 
          type="text" 
          v-model="searchQuery" 
          @input="updateSearch" 
          placeholder="Search by name..." 
        />
        <button @click="updateSearch">Search</button> <!-- Added search button -->
    </div>
</template>

<style scoped>
/* Add any styles for the search bar here */
</style>