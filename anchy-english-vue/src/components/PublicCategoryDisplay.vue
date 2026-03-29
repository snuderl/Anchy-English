<template>
  <div v-if="worksheets" class="mb-5">
    <li class="font-semibold text-gray-800 dark:text-gray-100 mb-3 text-xl">
      Kategorija: {{ category.name }}
    </li>
    <ul class="ml-8">
      <div v-for="worksheet in filteredWorksheets" :key="worksheet.id">
        <li class="list-disc mb-2 text-lg flex items-center gap-2 flex-wrap">
          <router-link 
            :to="`/worksheets/${worksheet.id}?practice=true`" 
            class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
          >
            {{ worksheet.ime }}
          </router-link>
          <router-link
            :to="`/worksheets/${worksheet.id}/match`"
            class="inline-flex items-center px-2 py-0.5 text-sm bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-colors duration-200"
          >
            🎮 Match
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