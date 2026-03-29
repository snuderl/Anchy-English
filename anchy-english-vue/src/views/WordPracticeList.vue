<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-5xl mx-auto px-4">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">Vaja besed</h1>
        <p class="text-xl text-gray-600 dark:text-gray-400">Izberi delovni list za reševanje</p>

        <div class="mt-4">
          <router-link
            to="/"
            class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
          >
            ← Nazaj na začetno stran
          </router-link>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <div class="text-xl text-gray-600 dark:text-gray-400 mt-4">Nalagam...</div>
      </div>

      <div v-else>
        <PublicCategoryDisplay
          v-for="category in rootCategories"
          :key="category.id"
          :category="category"
          :worksheets="worksheets"
          :categories="categories"
        />

        <div v-if="uncategorizedWorksheets.length > 0" class="mb-6">
          <h2 class="text-lg font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <span class="w-1.5 h-6 bg-gray-400 rounded-full"></span>
            Ostali
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              v-for="worksheet in uncategorizedWorksheets"
              :key="worksheet.id"
              class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <router-link
                :to="`/worksheets/${worksheet.id}?practice=true`"
                class="block text-lg font-semibold text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 mb-2"
              >
                {{ worksheet.ime }}
              </router-link>
              <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                </svg>
                {{ worksheet.words?.length || 0 }} besed
              </div>
              <div class="flex gap-2">
                <router-link
                  :to="`/worksheets/${worksheet.id}?practice=true`"
                  class="flex-1 text-center px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  ✍️ Črkuj
                </router-link>
                <router-link
                  :to="`/worksheets/${worksheet.id}/match`"
                  class="flex-1 text-center px-3 py-1.5 text-sm bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  🎮 Poveži
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-8">
        <button
          @click="$router.push('/')"
          class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300"
        >
          ← Nazaj na glavni meni
        </button>
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
