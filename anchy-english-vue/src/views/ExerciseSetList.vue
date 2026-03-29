<template>
  <div class="exercise-set-list min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="container mx-auto px-4 max-w-6xl">
      
      <!-- Header -->
      <div class="header text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">Vaje z dopolnjevanjem</h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-6">
          Vadite angleščino v kontekstu z vajami dopolnjevanja stavkov
        </p>
        
        <!-- Back to home -->
        <div class="mb-4">
          <router-link
            to="/"
            class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
          >
            ← Nazaj na začetno stran
          </router-link>
        </div>
      </div>

      <!-- Exercise sets grid -->
      <div v-if="exerciseSets.length > 0" class="exercise-sets-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="exerciseSet in exerciseSets"
          :key="exerciseSet.id"
          class="exercise-set-card bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
          @click="startPractice(exerciseSet.id)"
        >
          <div class="p-6">
            <!-- Set title -->
            <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{{ exerciseSet.name }}</h3>
            
            <!-- Description -->
            <p v-if="exerciseSet.description" class="text-gray-600 dark:text-gray-400 mb-4">
              {{ exerciseSet.description }}
            </p>
            
            <!-- Exercise count -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center text-sm text-gray-500">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                {{ exerciseSet.exercises?.length || 0 }} vaj
              </div>
              
              <!-- Categories -->
              <div v-if="exerciseSet.categories?.length" class="flex flex-wrap gap-1">
                <span
                  v-for="category in exerciseSet.categories.slice(0, 2)"
                  :key="category.id"
                  class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                >
                  {{ category.name }}
                </span>
                <span
                  v-if="exerciseSet.categories.length > 2"
                  class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                >
                  +{{ exerciseSet.categories.length - 2 }}
                </span>
              </div>
            </div>
            
            <!-- Start button -->
            <button class="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-300">
              Začni vaditi
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="!loading" class="empty-state text-center py-12">
        <div class="text-6xl mb-4">📝</div>
        <h3 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Ni razpoložljivih vaj</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">Še ni ustvarjenih vaj z dopolnjevanjem.</p>
        <button
          @click="goToAdmin"
          class="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-300"
        >
          Ustvari vaje
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="loading text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <div class="text-xl text-gray-600 dark:text-gray-400 mt-4">Nalagam vaje...</div>
      </div>

      <!-- Back to main menu -->
      <div class="text-center mt-8">
        <button
          @click="goToMain"
          class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300"
        >
          ← Nazaj na glavni meni
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const exerciseSets = ref([])
const loading = ref(true)

async function loadExerciseSets() {
  try {
    const response = await fetch('/api/exercise-sets')
    const data = await response.json()
    
    exerciseSets.value = data || []
  } catch (error) {
    console.error('Error loading exercise sets:', error)
    exerciseSets.value = []
  } finally {
    loading.value = false
  }
}

function startPractice(exerciseSetId) {
  router.push(`/exercise-sets/${exerciseSetId}/practice`)
}

function goToAdmin() {
  router.push('/admin')
}

function goToMain() {
  router.push('/')
}

onMounted(() => {
  loadExerciseSets()
})
</script>

<style scoped>
.exercise-set-card:hover {
  transform: translateY(-2px);
}

.exercise-set-card:active {
  transform: translateY(0);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.exercise-sets-grid > * {
  animation: fadeIn 0.3s ease-out;
}

.exercise-sets-grid > *:nth-child(1) { animation-delay: 0.1s; }
.exercise-sets-grid > *:nth-child(2) { animation-delay: 0.2s; }
.exercise-sets-grid > *:nth-child(3) { animation-delay: 0.3s; }
.exercise-sets-grid > *:nth-child(4) { animation-delay: 0.4s; }
.exercise-sets-grid > *:nth-child(5) { animation-delay: 0.5s; }
.exercise-sets-grid > *:nth-child(6) { animation-delay: 0.6s; }
</style>