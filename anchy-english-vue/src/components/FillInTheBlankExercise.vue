<template>
  <div class="fill-in-blank-exercise p-6 bg-white rounded-lg shadow-md">
    <!-- Exercise sentence with input field -->
    <div class="sentence-display mb-6">
      <div class="text-2xl leading-relaxed text-gray-800 flex flex-wrap items-center gap-2">
        <template v-for="(part, index) in sentenceParts" :key="index">
          <span class="sentence-part">{{ part }}</span>
          <span 
            v-if="index < sentenceParts.length - 1" 
            class="word-slot px-3 py-1 mx-1 border-2 border-dashed border-gray-400 rounded-md bg-gray-50 min-w-24 inline-block text-center transition-all duration-300"
            :class="{
              'bg-green-100 border-green-400 text-green-800': isAnswered && isCorrect,
              'bg-red-100 border-red-400 text-red-800': isAnswered && !isCorrect,
              'bg-blue-50 border-blue-300': userAnswer && !isAnswered
            }"
          >
            {{ userAnswer || '____' }}
          </span>
        </template>
      </div>
    </div>

    <!-- Feedback section -->
    <div v-if="feedback" class="feedback mb-4 p-4 rounded-lg transition-all duration-300" :class="feedbackClass">
      <div class="flex items-center gap-2">
        <span class="text-2xl">{{ isCorrect ? '✅' : '❌' }}</span>
        <div>
          <p class="font-semibold">{{ feedback }}</p>
          <p v-if="!isCorrect && correctAnswer" class="text-sm mt-1">
            Correct answer: <strong>{{ correctAnswer }}</strong>
          </p>
          <p v-if="sloveneHint" class="text-sm mt-1 text-gray-600">
            Slovene: {{ sloveneHint }}
          </p>
        </div>
      </div>
    </div>

    <!-- Word Bank -->
    <div v-if="wordBank.length > 0" class="word-bank mb-6">
      <h3 class="text-lg font-semibold text-gray-700 mb-3 text-center">Word Bank - Choose the correct word:</h3>
      <div class="flex flex-wrap gap-2 justify-center">
        <button
          v-for="word in wordBank"
          :key="word"
          @click="selectWord(word)"
          :disabled="isAnswered && isCorrect"
          class="word-option px-4 py-2 bg-gray-100 hover:bg-blue-100 border border-gray-300 rounded-lg transition-all duration-200"
          :class="{
            'bg-green-200 border-green-400': isAnswered && userAnswer.toLowerCase() === word.toLowerCase() && isCorrect,
            'bg-red-200 border-red-400': isAnswered && userAnswer.toLowerCase() === word.toLowerCase() && !isCorrect,
            'cursor-not-allowed opacity-50': isAnswered && isCorrect
          }"
        >
          {{ word }}
        </button>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="actions flex gap-3 justify-center">
      <button
        v-if="!isAnswered"
        @click="checkAnswer"
        :disabled="!userAnswer.trim()"
        class="check-btn px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300"
      >
        Check Answer
      </button>
      
      <button
        v-if="isAnswered"
        @click="nextExercise"
        class="next-btn px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-300"
      >
        Next Exercise
      </button>
      
      <button
        v-if="isAnswered && !isCorrect"
        @click="tryAgain"
        class="retry-btn px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300"
      >
        Try Again
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  exercise: {
    type: Object,
    required: true
  },
  wordBank: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['next', 'correct', 'incorrect'])

const userAnswer = ref('')
const feedback = ref('')
const isAnswered = ref(false)
const isCorrect = ref(false)
const correctAnswer = ref('')
const showHint = ref(false)

const sentenceParts = computed(() => {
  return props.exercise.sentence_template.split('_____')
})

const sloveneHint = computed(() => {
  return props.exercise.slovene_hint || ''
})

const feedbackClass = computed(() => {
  return isCorrect.value 
    ? 'bg-green-100 border border-green-300 text-green-800' 
    : 'bg-red-100 border border-red-300 text-red-800'
})

function clearFeedback() {
  if (isAnswered.value) {
    feedback.value = ''
    isAnswered.value = false
    isCorrect.value = false
  }
}

// eslint-disable-next-line no-unused-vars
function toggleHint() {
  showHint.value = !showHint.value
}

function selectWord(word) {
  if (isAnswered.value && isCorrect.value) return
  userAnswer.value = word
  clearFeedback()
}

async function checkAnswer() {
  if (!userAnswer.value.trim()) return
  
  try {
    const response = await fetch('/api/exercises/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        exercise_id: props.exercise.id,
        user_answer: userAnswer.value
      })
    })
    
    const result = await response.json()
    
    isAnswered.value = true
    isCorrect.value = result.correct
    correctAnswer.value = result.correct_answer
    
    if (result.correct) {
      feedback.value = 'Correct! Well done! 🎉'
      emit('correct')
    } else {
      feedback.value = 'Not quite right. Try again!'
      emit('incorrect')
    }
    
  } catch (error) {
    console.error('Error validating answer:', error)
    feedback.value = 'Error checking answer. Please try again.'
  }
}

function tryAgain() {
  feedback.value = ''
  isAnswered.value = false
  isCorrect.value = false
  userAnswer.value = ''
  showHint.value = false
}

function nextExercise() {
  emit('next')
}

// Watch for exercise changes to reset state
watch(() => props.exercise, () => {
  userAnswer.value = ''
  feedback.value = ''
  isAnswered.value = false
  isCorrect.value = false
  correctAnswer.value = ''
  showHint.value = false
}, { deep: true })

onMounted(() => {
  // Component ready - no input field to focus
})
</script>

<style scoped>
.sentence-part {
  line-height: 1.5;
}

.word-slot {
  font-family: inherit;
  font-weight: 500;
  transition: all 0.3s ease;
}

.word-option:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.feedback {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>