<template>
  <div class="max-w-5xl mx-auto p-8">
    <div v-if="!categoryId">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Admin Panel - Delovni Listi</h1>
        <p class="text-lg text-gray-600 mb-4">Upravljaj in urejaj delovne liste</p>
        <div class="flex gap-4">
          <router-link 
            to="/admin/worksheets/new"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
          >
            + Nov Delovni List
          </router-link>
          <router-link 
            to="/admin/categories"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Upravljaj Kategorije
          </router-link>
        </div>
      </div>
      
      <div v-if="loading" class="text-center py-8">
        <p class="text-xl text-gray-600">Nalagam delovne liste...</p>
      </div>
      
      <div v-else-if="worksheets.length === 0" class="text-center py-8">
        <p class="text-xl text-gray-600 mb-4">Ni najdenih delovnih listov</p>
        <router-link 
          to="/admin/worksheets/new"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
        >
          Ustvari prvi delovni list
        </router-link>
      </div>
      
      <ul v-else class="mb-5 text-lg">
        <CategoryDisplay 
          v-for="category in rootCategories" 
          :key="category.id"
          :category="category"
          :worksheets="worksheets"
          :categories="categories"
        />
      </ul>

      <div v-if="uncategorizedWorksheets.length > 0" class="mt-8">
        <p class="font-semibold text-gray-800 mb-3 text-xl">Ostali:</p>
        <div class="ml-8">
          <div v-for="worksheet in uncategorizedWorksheets" :key="worksheet.id" class="mb-3">
            <div class="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div>
                <span class="text-lg font-medium text-gray-800">{{ worksheet.ime }}</span>
                <span class="text-sm text-gray-500 ml-2">({{ worksheet.words?.length || 0 }} besed)</span>
              </div>
              <div class="flex gap-2">
                <router-link 
                  :to="`/admin/worksheets/${worksheet.id}`" 
                  class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors duration-200"
                >
                  Uredi
                </router-link>
                <router-link 
                  :to="`/worksheets/${worksheet.id}?practice=true`" 
                  class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors duration-200"
                >
                  Reši
                </router-link>
              </div>
            </div>
          </div>
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
    router.push('/admin/worksheets')
  } catch (error) {
    console.error('Failed to delete category:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>