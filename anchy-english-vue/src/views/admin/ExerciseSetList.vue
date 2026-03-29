<template>
  <div class="max-w-5xl mx-auto p-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Exercise Sets</h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-4">Manage fill-in-the-blank exercise sets</p>
      <router-link
        to="/admin/exercise-sets/new"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
      >
        + New Exercise Set
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-8">
      <p class="text-xl text-gray-600 dark:text-gray-400">Loading exercise sets...</p>
    </div>

    <div v-else-if="exerciseSets.length === 0" class="text-center py-8">
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-4">No exercise sets found</p>
      <router-link
        to="/admin/exercise-sets/new"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
      >
        Create first exercise set
      </router-link>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="set in exerciseSets"
        :key="set.id"
        class="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div>
          <span class="text-lg font-medium text-gray-800 dark:text-gray-100">{{ set.name }}</span>
          <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">({{ set.exercises?.length || 0 }} exercises)</span>
          <p v-if="set.description" class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ set.description }}</p>
          <div v-if="set.categories?.length" class="flex gap-1 mt-1">
            <span
              v-for="cat in set.categories"
              :key="cat.id"
              class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded"
            >
              {{ cat.name }}
            </span>
          </div>
        </div>
        <div class="flex gap-2">
          <router-link
            :to="`/admin/exercise-sets/${set.id}`"
            class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors duration-200"
          >
            Edit
          </router-link>
          <router-link
            :to="`/exercise-sets/${set.id}/practice`"
            class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors duration-200"
          >
            Practice
          </router-link>
          <button
            @click="handleDelete(set)"
            class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getExerciseSets, deleteExerciseSet } from '@/api/exerciseSets'

const exerciseSets = ref([])
const loading = ref(true)

async function loadData() {
  try {
    loading.value = true
    exerciseSets.value = await getExerciseSets()
  } catch (error) {
    console.error('Failed to load exercise sets:', error)
  } finally {
    loading.value = false
  }
}

async function handleDelete(set) {
  if (!confirm(`Delete exercise set "${set.name}" and all its exercises?`)) return
  try {
    await deleteExerciseSet(set.id)
    await loadData()
  } catch (error) {
    console.error('Failed to delete exercise set:', error)
  }
}

onMounted(loadData)
</script>
