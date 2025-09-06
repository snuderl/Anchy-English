<template>
  <div class="max-w-5xl mx-auto p-8">
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Upravljanje Kategorij</h1>
      
      <!-- Add New Category Form -->
      <div class="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Dodaj Novo Kategorijo</h2>
        <div class="flex gap-4 items-end">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Ime kategorije</label>
            <input 
              v-model="newCategoryName"
              type="text" 
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Vnesite ime nove kategorije"
              @keyup.enter="addCategory"
            />
          </div>
          <button 
            @click="addCategory"
            :disabled="!newCategoryName.trim()"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Dodaj
          </button>
        </div>
      </div>

      <!-- Categories List -->
      <div v-if="loading" class="text-center py-8">
        <p class="text-gray-500">Nalagam kategorije...</p>
      </div>
      
      <div v-else-if="categories.length === 0" class="text-center py-8">
        <p class="text-gray-500">Ni kategorij. Dodajte prvo kategorijo zgoraj.</p>
      </div>

      <div v-else class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Obstoječe Kategorije</h2>
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <div class="flex items-center space-x-4">
            <div>
              <h3 class="font-medium text-gray-800">{{ category.name }}</h3>
              <p v-if="category.parent" class="text-sm text-gray-500">
                Nadkategorija: {{ category.parent }}
              </p>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">
              ID: {{ category.id }}
            </span>
            <button 
              @click="deleteCategory(category.id, category.name)"
              class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
            >
              Izbriši
            </button>
          </div>
        </div>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="message" class="mt-6">
        <div 
          :class="[
            'p-4 rounded-md',
            messageType === 'success' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'
          ]"
        >
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCategories, createCategory, deleteCategory as deleteCategoryApi } from '@/api/categories'

const categories = ref([])
const loading = ref(true)
const newCategoryName = ref('')
const message = ref('')
const messageType = ref('')

async function loadCategories() {
  try {
    loading.value = true
    categories.value = await getCategories()
  } catch (error) {
    showMessage('Napaka pri nalaganju kategorij: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

async function addCategory() {
  if (!newCategoryName.value.trim()) return
  
  try {
    await createCategory({ name: newCategoryName.value.trim() })
    showMessage(`Kategorija "${newCategoryName.value}" je bila uspešno dodana.`, 'success')
    newCategoryName.value = ''
    await loadCategories()
  } catch (error) {
    showMessage('Napaka pri dodajanju kategorije: ' + error.message, 'error')
  }
}

async function deleteCategory(categoryId, categoryName) {
  if (!confirm(`Ste prepričani, da želite izbrisati kategorijo "${categoryName}"?`)) {
    return
  }
  
  try {
    await deleteCategoryApi(categoryId)
    showMessage(`Kategorija "${categoryName}" je bila uspešno izbrisana.`, 'success')
    await loadCategories()
  } catch (error) {
    showMessage('Napaka pri brisanju kategorije: ' + error.message, 'error')
  }
}

function showMessage(text, type) {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

onMounted(() => {
  loadCategories()
})
</script>