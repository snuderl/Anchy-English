<template>
  <div v-if="worksheets" class="mb-5">
    <li class="font-semibold text-gray-800 mb-3 text-xl">
      Kategorija: {{ category.name }}
    </li>
    <ul class="ml-8">
      <div v-for="worksheet in filteredWorksheets" :key="worksheet.id" class="mb-3">
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
      <div 
        v-for="child in childCategories" 
        :key="child.id"
        v-show="getFilteredWorksheets(child.name).length > 0"
      >
        <CategoryDisplay 
          :category="child" 
          :worksheets="worksheets" 
          :categories="categories"
        />
      </div>
    </ul>
  </div>
  
  <div v-else class="mb-3">
    <li class="list-disc text-lg">
      <router-link 
        :to="`/admin/categories/${category.id}`" 
        class="text-blue-600 hover:text-blue-800 hover:underline font-medium"
      >
        {{ category.name }}
      </router-link>
    </li>
    <ul v-for="child in childCategories" :key="child.id" class="ml-8">
      <CategoryDisplay 
        :category="child" 
        :categories="categories"
      />
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  category: {
    type: Object,
    required: true
  },
  worksheets: {
    type: Array,
    default: null
  },
  categories: {
    type: Array,
    required: true
  }
})

const childCategories = computed(() => {
  return props.categories.filter(cat => cat.parent_id === props.category.id)
})

const filteredWorksheets = computed(() => {
  return getFilteredWorksheets(props.category.name)
})

function getFilteredWorksheets(categoryName) {
  if (!props.worksheets) return []
  
  return props.worksheets.filter(ws => {
    if (!categoryName && (!ws.categories || ws.categories.length === 0)) {
      return true
    }
    return ws.categories && ws.categories.some(cat => cat.name === categoryName)
  })
}

function containsCategory(worksheet, categoryName) {
  if (!worksheet.categories) return false
  return worksheet.categories.some(cat => cat.name === categoryName)
}
</script>