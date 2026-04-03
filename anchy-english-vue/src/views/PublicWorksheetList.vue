<template>
  <div class="max-w-5xl mx-auto p-8">
    <div class="text-center mb-8">
      <p class="text-xl text-gray-600 dark:text-gray-400">Izberi način učenja</p>
      
      <!-- Exercise type selection -->
      <div class="flex flex-col md:flex-row gap-6 justify-center mt-8">
        <router-link
          to="/exercise-sets"
          class="px-10 py-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center"
        >
          <div class="text-4xl mb-2">📝</div>
          <div class="text-xl">Vaje z dopolnjevanjem</div>
          <div class="text-sm opacity-90 mt-2">Vadite besedišče v kontekstu</div>
        </router-link>
        
        <router-link
          to="/word-practice"
          class="px-10 py-6 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center"
        >
          <div class="text-4xl mb-2">✍️</div>
          <div class="text-xl">Vaja besed</div>
          <div class="text-sm opacity-90 mt-2">Črkuj besede črko po črko</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// Home page - no additional logic needed
</script>