 <script setup lang="ts">
  const handleClick = () => {
    alert("Chat button clicked!");
  };

  </script>


  <template>
    <div class="chat-button" @click="handleClick">
        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
      <path fill="currentColor" fill-rule="evenodd" d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0m0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5z" clip-rule="evenodd"/>
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
  