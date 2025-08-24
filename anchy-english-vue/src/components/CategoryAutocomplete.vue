<template>
  <div class="autocomplete relative">
    <input
      v-model="query"
      @input="search"
      @keydown="handleKeydown"
      @focus="showSuggestions = true"
      @blur="hideSuggestions"
      placeholder="Kategorija"
      class="w-full px-4 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
    <ul 
      v-if="showSuggestions && suggestions.length" 
      class="suggestions absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-auto shadow-lg"
    >
      <li
        v-for="(category, index) in suggestions"
        :key="category.id || index"
        :class="{ 'bg-blue-100': index === selectedIndex }"
        @mousedown="selectCategory(category)"
        class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
      >
        {{ category.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ name: '' })
  },
  categories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const query = ref(props.modelValue.name || '')
const suggestions = ref([])
const selectedIndex = ref(-1)
const showSuggestions = ref(false)

function search() {
  if (!query.value) {
    suggestions.value = []
    return
  }
  
  const searchQuery = query.value.toLowerCase()
  suggestions.value = props.categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery)
  ).slice(0, 8)
  
  selectedIndex.value = -1
}

function selectCategory(category) {
  emit('update:modelValue', category)
  query.value = category.name
  suggestions.value = []
  showSuggestions.value = false
}

function handleKeydown(e) {
  if (!showSuggestions.value || !suggestions.value.length) return
  
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIndex.value = Math.min(selectedIndex.value + 1, suggestions.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
  } else if (e.key === 'Enter' && selectedIndex.value >= 0) {
    e.preventDefault()
    selectCategory(suggestions.value[selectedIndex.value])
  } else if (e.key === 'Escape') {
    showSuggestions.value = false
    suggestions.value = []
  }
}

function hideSuggestions() {
  // Delay to allow click on suggestion
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

// Update query when modelValue changes
watch(() => props.modelValue.name, (newVal) => {
  query.value = newVal || ''
})

// Update modelValue when query changes
watch(query, (newVal) => {
  emit('update:modelValue', { name: newVal })
})
</script>