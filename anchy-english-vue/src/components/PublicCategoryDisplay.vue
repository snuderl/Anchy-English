<template>
  <div v-if="filteredWorksheets.length > 0 || visibleChildren.length > 0" class="mb-6">
    <h2 class="text-lg font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
      <span class="w-1.5 h-6 bg-blue-500 rounded-full"></span>
      {{ category.name }}
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-2">
      <div
        v-for="worksheet in filteredWorksheets"
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
    <div v-for="child in visibleChildren" :key="child.id">
      <PublicCategoryDisplay
        :category="child"
        :worksheets="worksheets"
        :categories="categories"
      />
    </div>
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

const visibleChildren = computed(() => {
  return childCategories.value.filter(child => getFilteredWorksheets(child.name).length > 0)
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
