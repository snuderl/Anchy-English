<template>
  <nav class="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <h1 class="text-white text-2xl font-bold">Anchy English</h1>
          </div>
          <div class="ml-10 flex items-baseline space-x-4">
            <router-link 
              to="/worksheets" 
              class="text-gray-200 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              :class="{ 'bg-blue-900 text-white': $route.path.startsWith('/worksheets') }"
            >
              Worksheets
            </router-link>
            <router-link 
              to="/worksheets/new" 
              class="text-gray-200 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              New Worksheet
            </router-link>
            <router-link 
              to="/categories" 
              class="text-gray-200 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              :class="{ 'bg-blue-900 text-white': $route.path.startsWith('/categories') }"
            >
              Categories
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'

const $route = useRoute()
</script>