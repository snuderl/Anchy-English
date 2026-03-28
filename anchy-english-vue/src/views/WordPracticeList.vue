<template>
  <div class="max-w-5xl mx-auto p-8">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">Word Practice</h1>
      <p class="text-xl text-gray-600 dark:text-gray-400">Izberi delovni list za reševanje</p>
      
      <!-- Back to home -->
      <div class="mt-4">
        <router-link
          to="/"
          class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
        >
          ← Back to Home
        </router-link>
      </div>
    </div>
    
    <ul class="mb-5 text-lg">
      <PublicCategoryDisplay 
        v-for="category in rootCategories" 
        :key="category.id"
        :category="category"
        :worksheets="worksheets"
        :categories="categories"
      />
    </ul>

    <div v-if="uncategorizedWorksheets.length > 0" class="mt-8">
      <p class="font-medium text-gray-700 dark:text-gray-300 mb-3 text-xl">Ostali:</p>
      <div v-for="worksheet in uncategorizedWorksheets" :key="worksheet.id" class="ml-5">
        <li class="list-disc text-lg">
          <router-link 
            :to="`/worksheets/${worksheet.id}?practice=true`" 
            class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
          >
            {{ worksheet.ime }}
          </router-link>
        </li>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getWorksheets } from '@/api/worksheets'
import { getCategories } from '@/api/categories'
import PublicCategoryDisplay from '@/components/PublicCategoryDisplay.vue'

const worksheets = ref([])
const categories = ref([])
const loading = ref(false)

const rootCategories = computed(() => {
  return categories.value.filter(cat => !cat.parent)
})

const uncategorizedWorksheets = computed(() => {
  return worksheets.value.filter(ws => !ws.categories || ws.categories.length === 0)
})

async function loadData() {
  loading.value = true
  try {
    const [worksheetsData, categoriesData] = await Promise.all([
      getWorksheets(),
      getCategories()
    ])
    
    worksheets.value = worksheetsData
    categories.value = categoriesData
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>