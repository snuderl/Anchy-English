<template>
  <button
    @click="toggle"
    class="p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    type="button"
  >
    <span class="text-xl">{{ isDark ? '☀️' : '🌙' }}</span>
  </button>
</template>

<script setup>
import { useDarkMode } from '@/composables/useDarkMode'

const { isDark, toggle } = useDarkMode()
</script>
