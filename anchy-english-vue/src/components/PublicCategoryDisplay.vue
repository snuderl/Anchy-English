<template>
  <div v-if="worksheets" class="mb-5">
    <li class="font-semibold text-gray-800 mb-3 text-xl">
      Kategorija: {{ category.name }}
    </li>
    <ul class="ml-8">
      <div v-for="worksheet in filteredWorksheets" :key="worksheet.id">
        <li class="list-disc mb-2 text-lg">
          <router-link 
            :to="`/worksheets/${worksheet.id}?practice=true`" 
            class="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {{ worksheet.ime }}
          </router-link>
        </li>
      </div>
      <div 
        v-for="child in childCategories" 
        :key="child.id"
        v-show="getFilteredWorksheets(child.name).length > 0"
      >
        <PublicCategoryDisplay 
          :category="child" 
          :worksheets="worksheets" 
          :categories="categories"
        />
      </div>
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
</script>