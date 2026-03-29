<template>
  <div 
    class="streak-counter inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 select-none"
    :class="containerClass"
  >
    <span class="streak-icon text-xl transition-transform duration-300" :class="{ 'animate-streakPop': justChanged }">
      {{ icon }}
    </span>
    <span class="streak-value text-lg tabular-nums">{{ streak }}</span>
    <span class="streak-label text-sm opacity-80">{{ label }}</span>
    
    <!-- Milestone badge -->
    <Transition name="badge">
      <span 
        v-if="showMilestone" 
        class="milestone-badge ml-1 px-2 py-0.5 text-xs font-bold rounded-full bg-white/30 backdrop-blur-sm"
      >
        {{ milestoneText }}
      </span>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  streak: {
    type: Number,
    default: 0
  },
  label: {
    type: String,
    default: 'streak'
  },
  best: {
    type: Number,
    default: 0
  }
})

const justChanged = ref(false)
const showMilestone = ref(false)

const icon = computed(() => {
  if (props.streak === 0) return ''
  if (props.streak < 10) return '✨'
  if (props.streak < 50) return '🔥'
  if (props.streak < 100) return '⚡'
  return '🌟'
})

const containerClass = computed(() => {
  if (props.streak === 0) return 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
  if (props.streak < 10) return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
  if (props.streak < 20) return 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
  if (props.streak < 50) return 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
  if (props.streak < 100) return 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300'
  if (props.streak < 500) return 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
  return 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
})

const milestoneText = computed(() => {
  if (props.streak >= 500) return '🌟 LEGENDARY!'
  if (props.streak >= 100) return '⚡ AMAZING!'
  if (props.streak >= 50) return '🔥 ON FIRE!'
  if (props.streak >= 20) return 'NICE!'
  if (props.streak >= 10) return 'GOOD!'
  return ''
})

const milestones = [10, 20, 50, 100, 500]

watch(() => props.streak, (newVal, oldVal) => {
  if (newVal > oldVal) {
    justChanged.value = true
    setTimeout(() => { justChanged.value = false }, 400)
    
    if (milestones.includes(newVal)) {
      showMilestone.value = true
      setTimeout(() => { showMilestone.value = false }, 2500)
    }
  }
})
</script>

<style scoped>
@keyframes streakPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.4) rotate(10deg); }
  100% { transform: scale(1); }
}

.animate-streakPop {
  animation: streakPop 0.4s ease-out;
}

.badge-enter-active {
  animation: badgeIn 0.4s ease-out;
}
.badge-leave-active {
  animation: badgeOut 0.3s ease-in;
}

@keyframes badgeIn {
  0% { opacity: 0; transform: scale(0.5) translateY(-4px); }
  60% { transform: scale(1.1) translateY(0); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes badgeOut {
  to { opacity: 0; transform: scale(0.8); }
}
</style>
