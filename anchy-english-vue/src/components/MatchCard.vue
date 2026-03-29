<template>
  <button
    :class="cardClasses"
    :aria-label="`${column === 'en' ? 'English' : 'Slovene'}: ${text}`"
    :aria-pressed="matchState === 'selected'"
    :aria-hidden="matched"
    :disabled="matched"
    @click="$emit('select')"
  >
    {{ text }}
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
  column: { type: String, required: true },
  matched: { type: Boolean, default: false },
  matchState: { type: String, default: 'neutral' },
})

defineEmits(['select'])

const cardClasses = computed(() => {
  const base =
    'w-full px-4 py-3 rounded-lg text-lg font-medium cursor-pointer transition-all duration-150 border-2 min-h-[44px] text-left'

  if (props.matched) {
    return `${base} opacity-0 scale-75 pointer-events-none`
  }

  switch (props.matchState) {
    case 'selected':
      return `${base} bg-blue-100 dark:bg-blue-800 border-blue-500 ring-2 ring-blue-300 text-gray-800 dark:text-gray-100`
    case 'correct':
      return `${base} bg-green-100 dark:bg-green-800 border-green-500 text-green-800 dark:text-green-100`
    case 'wrong':
      return `${base} bg-red-100 dark:bg-red-800 border-red-500 text-red-800 dark:text-red-100 animate-shake`
    default:
      return `${base} bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-gray-800 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-blue-800/50`
  }
})
</script>
