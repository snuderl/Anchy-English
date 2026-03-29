<template>
  <div class="fill-in-blank-exercise p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <!-- Exercise sentence with input field -->
    <div class="sentence-display mb-6">
      <p class="text-2xl leading-relaxed text-gray-800 dark:text-gray-100">
        <template v-for="(part, index) in sentenceParts" :key="index">
          <span>{{ part }}</span>
          <span
            v-if="index < sentenceParts.length - 1"
            class="word-slot"
            :class="{
              correct: isAnswered && isCorrect,
              incorrect: isAnswered && !isCorrect,
            }"
          >{{ userAnswer || '?' }}</span>
        </template>
      </p>
    </div>

    <!-- Feedback section -->
    <div v-if="feedback" class="feedback mb-4 p-4 rounded-lg transition-all duration-300" :class="feedbackClass">
      <div class="flex items-center gap-2">
        <span class="text-2xl">{{ isCorrect ? '✅' : '❌' }}</span>
        <div>
          <p class="font-semibold">{{ feedback }}</p>
          <p v-if="!isCorrect && correctAnswer" class="text-sm mt-1">
            Pravilen odgovor: <strong>{{ correctAnswer }}</strong>
          </p>
          <p v-if="sloveneHint" class="text-sm mt-1 text-gray-600">
            Slovensko: {{ sloveneHint }}
          </p>
        </div>
      </div>
    </div>

    <!-- Word Bank -->
    <div v-if="wordBank.length > 0" class="word-bank mb-6">
      <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">Banka besed - Izberi pravilno besedo:</h3>
      <div class="flex flex-wrap gap-2 justify-center">
        <button
          v-for="word in wordBank"
          :key="word"
          @click="selectWord(word)"
          :disabled="isAnswered"
          class="word-option px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 border border-gray-300 dark:border-gray-600 dark:text-gray-200 rounded-lg transition-all duration-200"
          :class="{
            'bg-green-200 border-green-400': isAnswered && userAnswer.toLowerCase() === word.toLowerCase() && isCorrect,
            'bg-red-200 border-red-400': isAnswered && userAnswer.toLowerCase() === word.toLowerCase() && !isCorrect,
            'cursor-not-allowed opacity-50': isAnswered
          }"
        >
          {{ word }}
        </button>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="actions flex gap-3 justify-center">
      <button
        v-if="isAnswered"
        @click="nextExercise"
        class="next-btn px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-300"
      >
        Naslednja vaja
      </button>

      <button
        v-if="isAnswered && !isCorrect"
        @click="tryAgain"
        class="retry-btn px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300"
      >
        Poskusi znova
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


function selectWord(word) {
  if (isAnswered.value) return
  userAnswer.value = word
  checkAnswer()
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
      feedback.value = 'Pravilno! Odlično! 🎉'
      emit('correct')
    } else {
      feedback.value = 'Ni čisto prav. Poskusi znova!'
      emit('incorrect')
    }
    
  } catch (error) {
    console.error('Error validating answer:', error)
    feedback.value = 'Napaka pri preverjanju. Poskusi znova.'
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
  display: inline-block;
  min-width: 8rem;
  padding: 0.125rem 0.75rem;
  margin: 0 0.25rem;
  border-bottom: 4px solid #60a5fa;
  border-radius: 0.25rem;
  background: #eff6ff;
  text-align: center;
  font-weight: 500;
  transition: all 0.3s ease;
}

.word-slot.correct {
  border-bottom-color: #22c55e;
  background: #dcfce7;
  color: #166534;
  font-weight: 600;
}

.word-slot.incorrect {
  border-bottom-color: #ef4444;
  background: #fee2e2;
  color: #991b1b;
  font-weight: 600;
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