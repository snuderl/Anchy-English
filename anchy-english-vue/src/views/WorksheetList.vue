<template>
  <div class="max-w-5xl mx-auto p-8">
    <div v-if="!categoryId">
      <p class="text-2xl font-semibold text-gray-800 mb-6">Seznam vseh delovnih listov</p>
      
      <ul class="mb-5 text-lg">
        <CategoryDisplay 
          v-for="category in rootCategories" 
          :key="category.id"
          :category="category"
          :worksheets="worksheets"
          :categories="categories"
        />
      </ul>

      <div v-if="uncategorizedWorksheets.length > 0" class="mt-8">
        <p class="font-medium text-gray-700 mb-3 text-xl">Ostali:</p>
        <div v-for="worksheet in uncategorizedWorksheets" :key="worksheet.id" class="ml-5">
          <li class="list-disc text-lg">
            <router-link 
              :to="`/worksheets/${worksheet.id}`" 
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {{ worksheet.ime }}
            </router-link>
          </li>
        </div>
      </div>
    </div>

    <div v-if="categoryId && currentCategory">
      <CategoryDisplay 
        :category="currentCategory"
        :worksheets="worksheets"
        :categories="categories"
      />

      <div v-if="canDeleteCategory" class="mt-6">
        <button 
          type="button" 
          class="px-6 py-3 text-lg bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors duration-200"
          @click="deleteCategory"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getWorksheets } from '@/api/worksheets'
import { getCategories, getCategory, deleteCategory as deleteCategoryApi } from '@/api/categories'
import CategoryDisplay from '@/components/CategoryDisplay.vue'

const route = useRoute()
const router = useRouter()

const worksheets = ref([])
const categories = ref([])
const currentCategory = ref(null)
const loading = ref(false)

const categoryId = computed(() => route.params.id)

const rootCategories = computed(() => {
  return categories.value.filter(cat => !cat.parent)
})

const uncategorizedWorksheets = computed(() => {
  return worksheets.value.filter(ws => !ws.categories || ws.categories.length === 0)
})

const canDeleteCategory = computed(() => {
  if (!categoryId.value || !currentCategory.value) return false
  const categoryWorksheets = filterWorksheetsByCategory(currentCategory.value.name)
  return categoryWorksheets.length === 0
})

function filterWorksheetsByCategory(categoryName) {
  if (!worksheets.value) return []
  
  return worksheets.value.filter(ws => {
    if (!categoryName && (!ws.categories || ws.categories.length === 0)) {
      return true
    }
    return ws.categories && ws.categories.some(cat => cat.name === categoryName)
  })
}

async function loadData() {
  loading.value = true
  try {
    const [worksheetsData, categoriesData] = await Promise.all([
      getWorksheets(),
      getCategories()
    ])
    
    worksheets.value = worksheetsData
    categories.value = categoriesData
    
    if (categoryId.value) {
      currentCategory.value = await getCategory(categoryId.value)
    }
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    loading.value = false
  }
}

async function deleteCategory() {
  if (!canDeleteCategory.value) return
  
  try {
    await deleteCategoryApi(categoryId.value)
    router.push('/worksheets')
  } catch (error) {
    console.error('Failed to delete category:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>