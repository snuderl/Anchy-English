<template>
  <nav class="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-gray-900 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <router-link to="/" class="text-white text-2xl font-bold hover:text-gray-200">
              Anchy English
            </router-link>
          </div>
        </div>
        <DarkModeToggle />
      </div>
    </div>
  </nav>
</template>

<script setup>
import DarkModeToggle from '@/components/DarkModeToggle.vue'
</script>