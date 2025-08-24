<template>
  <div class="autocomplete relative">
    <input
      v-model="query"
      @input="search"
      @keydown="handleKeydown"
      @focus="showSuggestions = true"
      @blur="hideSuggestions"
      :placeholder="placeholder"
      class="w-full px-4 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
    <ul 
      v-if="showSuggestions && suggestions.length" 
      class="suggestions absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-auto shadow-lg"
    >
      <li
        v-for="(word, index) in suggestions"
        :key="word.id || index"
        :class="{ 'bg-blue-100': index === selectedIndex }"
        @mousedown="selectWord(word)"
        class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
      >
        {{ word.english }} - {{ word.slovene }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ english: '', slovene: '' })
  },
  field: {
    type: String,
    default: 'english'
  },
  words: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Search words...'
  }
})

const emit = defineEmits(['update:modelValue'])

const query = ref(props.modelValue[props.field] || '')
const suggestions = ref([])
const selectedIndex = ref(-1)
const showSuggestions = ref(false)

function search() {
  if (!query.value || query.value.length < 2) {
    suggestions.value = []
    return
  }
  
  const searchQuery = query.value.toLowerCase()
  suggestions.value = props.words.filter(word => 
    word.english.toLowerCase().includes(searchQuery) ||
    word.slovene.toLowerCase().includes(searchQuery)
  ).slice(0, 8)
  
  selectedIndex.value = -1
}

function selectWord(word) {
  emit('update:modelValue', word)
  query.value = word[props.field]
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
    selectWord(suggestions.value[selectedIndex.value])
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
watch(() => props.modelValue[props.field], (newVal) => {
  query.value = newVal || ''
})

// Update modelValue when query changes
watch(query, (newVal) => {
  const updatedValue = { ...props.modelValue }
  updatedValue[props.field] = newVal
  emit('update:modelValue', updatedValue)
})
</script>