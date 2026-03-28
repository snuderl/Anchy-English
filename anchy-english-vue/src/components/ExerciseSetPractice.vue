<template>
  <div class="exercise-set-practice min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      
      <!-- Header with progress -->
      <div class="header mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ exerciseSet?.name }}</h1>
        <p v-if="exerciseSet?.description" class="text-gray-600 mb-4">{{ exerciseSet.description }}</p>
        
        <!-- Progress bar -->
        <div class="progress-container bg-white rounded-lg p-4 shadow-sm">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium text-gray-600">Progress</span>
            <span class="text-sm font-medium text-gray-800">
              {{ currentExerciseIndex + 1 }} of {{ totalExercises }}
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div 
              class="bg-blue-500 h-3 rounded-full transition-all duration-300"
              :style="{ width: progressPercentage + '%' }"
            ></div>
          </div>
          <div class="mt-2 text-sm text-gray-600">
            {{ correctAnswers }} correct, {{ incorrectAnswers }} incorrect
          </div>
        </div>
      </div>

      <!-- Exercise content -->
      <div v-if="currentExercise && !isCompleted" class="exercise-content">
        <FillInTheBlankExercise
          :exercise="currentExercise"
          :wordBank="wordBank"
          @next="handleNext"
          @correct="handleCorrect"
          @incorrect="handleIncorrect"
        />
      </div>

      <!-- Completion screen -->
      <div v-if="isCompleted" class="completion-screen text-center bg-white rounded-lg p-8 shadow-md">
        <div class="mb-6">
          <div class="text-6xl mb-4">🎉</div>
          <h2 class="text-3xl font-bold text-green-600 mb-2">Congratulations!</h2>
          <p class="text-xl text-gray-700">You've completed the exercise set!</p>
        </div>
        
        <!-- Final statistics -->
        <div class="stats grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="stat bg-blue-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">{{ totalExercises }}</div>
            <div class="text-sm text-blue-800">Total</div>
          </div>
          <div class="stat bg-green-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ correctAnswers }}</div>
            <div class="text-sm text-green-800">Correct</div>
          </div>
          <div class="stat bg-red-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-red-600">{{ incorrectAnswers }}</div>
            <div class="text-sm text-red-800">Incorrect</div>
          </div>
          <div class="stat bg-yellow-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-yellow-600">{{ accuracyPercentage }}%</div>
            <div class="text-sm text-yellow-800">Accuracy</div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="actions flex gap-4 justify-center">
          <button
            @click="restartExercises"
            class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-300"
          >
            Practice Again
          </button>
          <button
            @click="goToExerciseSets"
            class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300"
          >
            Back to Exercise Sets
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="!exerciseSet" class="loading text-center py-12">
        <div class="text-xl text-gray-600">Loading exercises...</div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FillInTheBlankExercise from './FillInTheBlankExercise.vue'

const route = useRoute()
const router = useRouter()

const exerciseSet = ref(null)
const currentExerciseIndex = ref(0)
const correctAnswers = ref(0)
const incorrectAnswers = ref(0)
const isCompleted = ref(false)

const currentExercise = computed(() => {
  if (!exerciseSet.value?.exercises || currentExerciseIndex.value >= exerciseSet.value.exercises.length) {
    return null
  }
  return exerciseSet.value.exercises[currentExerciseIndex.value]
})

const wordBank = computed(() => {
  if (!exerciseSet.value?.exercises) return []
  
  // Get all missing words from the exercise set and shuffle them
  const words = exerciseSet.value.exercises.map(ex => ex.missing_word)
  return shuffleArray([...words])
})

const totalExercises = computed(() => {
  return exerciseSet.value?.exercises?.length || 0
})

const progressPercentage = computed(() => {
  if (totalExercises.value === 0) return 0
  return Math.round((currentExerciseIndex.value / totalExercises.value) * 100)
})

const accuracyPercentage = computed(() => {
  const total = correctAnswers.value + incorrectAnswers.value
  if (total === 0) return 0
  return Math.round((correctAnswers.value / total) * 100)
})

async function loadExerciseSet() {
  try {
    const response = await fetch(`/api/exercise-sets/${route.params.id}`)
    const data = await response.json()
    
    if (data.error) {
      console.error('Error loading exercise set:', data.error)
      return
    }
    
    exerciseSet.value = data
    
    // Shuffle exercises for varied practice
    if (exerciseSet.value.exercises) {
      exerciseSet.value.exercises = shuffleArray([...exerciseSet.value.exercises])
    }
  } catch (error) {
    console.error('Error loading exercise set:', error)
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

function handleNext() {
  if (currentExerciseIndex.value < totalExercises.value - 1) {
    currentExerciseIndex.value++
  } else {
    isCompleted.value = true
  }
}

function handleCorrect() {
  correctAnswers.value++
}

function handleIncorrect() {
  incorrectAnswers.value++
}

function restartExercises() {
  currentExerciseIndex.value = 0
  correctAnswers.value = 0
  incorrectAnswers.value = 0
  isCompleted.value = false
  
  // Shuffle exercises again for variety
  if (exerciseSet.value?.exercises) {
    exerciseSet.value.exercises = shuffleArray([...exerciseSet.value.exercises])
  }
}

function goToExerciseSets() {
  router.push('/exercise-sets')
}

onMounted(() => {
  loadExerciseSet()
})
</script>

<style scoped>
.progress-container {
  max-width: 600px;
  margin: 0 auto;
}

.completion-screen {
  animation: celebration 0.6s ease-out;
}

@keyframes celebration {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.stat {
  transition: transform 0.2s ease;
}

.stat:hover {
  transform: translateY(-2px);
}
</style>