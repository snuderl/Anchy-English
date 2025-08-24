<template>
  <div class="inline-flex items-end gap-2 flex-nowrap">
    <div 
      v-for="(char, index) in pair.english" 
      :key="index"
      class="w-10 h-24 inline-block align-bottom text-center mx-1 relative flex-shrink-0"
    >
      <!-- Arrow indicator for practice mode -->
      <span 
        v-if="showArrow(index)"
        class="text-blue-500 text-2xl animate-pulse absolute -top-2 left-0 right-0 z-10"
      >
        ↓
      </span>
      
      <!-- Space or undefined character -->
      <div 
        v-if="skip(char)"
        class="w-10 h-10 text-2xl leading-10 font-medium absolute bottom-4"
      >
        {{ char }}
      </div>
      
      <!-- Character boxes -->
      <div v-else>
        <!-- Normal height characters (mapping == 0) -->
        <div 
          v-if="charMapping[char] === 0"
          class="w-10 h-10 text-2xl font-medium border-2 border-gray-300 rounded-md bg-gray-50 transition-all duration-300 flex items-center justify-center absolute bottom-4 left-0"
          :class="getCharClass(index)"
        >
          {{ displayChar(index) }}
        </div>
        
        <!-- Tall characters with ascenders (mapping == 1) -->
        <div 
          v-if="charMapping[char] === 1"
          class="w-10 h-14 text-2xl font-medium border-2 border-gray-300 rounded-md bg-gray-50 transition-all duration-300 flex items-center justify-center absolute bottom-4 left-0"
          :class="getCharClass(index)"
        >
          {{ displayChar(index) }}
        </div>
        
        <!-- Characters with descenders (mapping == 2) -->
        <div 
          v-if="charMapping[char] === 2"
          class="w-10 h-14 text-2xl font-medium border-2 border-gray-300 rounded-md bg-gray-50 transition-all duration-300 flex items-start justify-center pt-1 absolute bottom-0 left-0"
          :class="getCharClass(index)"
        >
          {{ displayChar(index) }}
        </div>
      </div>
    </div>
    
    <!-- Success checkmark -->
    <span 
      v-if="isCompleted"
      class="text-success text-4xl ml-3 animate-checkmarkPop align-bottom"
    >
      ✓
    </span>
    
    <!-- Input field for practice mode -->
    <div v-if="practiceMode && !isCompleted" class="inline-block align-bottom">
      <input 
        :id="`input${index}`"
        v-model="input"
        type="text"
        class="px-4 py-3 text-xl border-2 border-blue-500 rounded-md w-64 ml-5 transition-all duration-300 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-25"
        placeholder="Enter answer"
        @input="handleInput"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  pair: {
    type: Object,
    required: true
  },
  showAnswer: {
    type: Boolean,
    default: true
  },
  practiceMode: {
    type: Boolean,
    default: false
  },
  index: {
    type: Number,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:completed'])

// Character mapping for box heights
const charMapping = {
  "a": 0, "A": 1,
  "b": 1, "B": 1,
  "c": 0, "C": 1,
  "d": 1, "D": 1,
  "e": 0, "E": 1,
  "f": 1, "F": 1,
  "g": 2, "G": 1,
  "h": 1, "H": 1,
  "i": 0, "I": 1,
  "j": 2, "J": 1,
  "k": 1, "K": 1,
  "l": 1, "L": 1,
  "m": 0, "M": 1,
  "n": 0, "N": 1,
  "o": 0, "O": 1,
  "p": 2, "P": 1,
  "r": 0, "R": 1,
  "s": 0, "S": 1,
  "t": 1, "T": 1,
  "u": 0, "U": 1,
  "v": 0, "V": 1,
  "q": 2, "Q": 1,
  "z": 0, "Z": 1,
  "y": 2, "Y": 1,
  "x": 0, "X": 1,
  "w": 0, "W": 1
}

const input = ref('')
const inputArray = ref([])
const errorCount = ref(0)

const isCompleted = computed(() => props.completed)

function skip(char) {
  return char === ' ' || charMapping[char] === undefined
}

function showArrow(index) {
  return props.practiceMode && index === input.value.length
}

function displayChar(index) {
  if (props.showAnswer) {
    return props.pair.english[index]
  }
  if (props.practiceMode) {
    return inputArray.value[index] || ''
  }
  return ''
}

function getCharClass(index) {
  if (!props.practiceMode) return ''
  
  const correctChar = props.pair.english[index]
  const enteredChar = inputArray.value[index]
  
  if (!enteredChar) return ''
  
  if (correctChar === enteredChar) {
    return 'border-success border-4 bg-green-100 text-green-800 animate-correctPulse'
  } else if (correctChar === enteredChar.toLowerCase() || correctChar === enteredChar.toUpperCase()) {
    return 'border-warning border-4 bg-yellow-100 text-yellow-800'
  } else {
    return 'border-danger border-4 bg-red-100 text-red-800 animate-wrongShake'
  }
}

function isFinished(inputValue) {
  const word = props.pair.english
  if (inputValue.length !== word.length) {
    return false
  }
  
  for (let i = 0; i < inputValue.length; i++) {
    if (inputValue[i] !== word[i]) {
      return false
    }
  }
  return true
}

function handleInput() {
  const newValue = input.value
  
  if (newValue.length > props.pair.english.length) {
    input.value = newValue.substring(0, props.pair.english.length)
    return
  }
  
  // Update input array
  inputArray.value = newValue.split('')
  
  // Check for errors
  for (let i = 0; i < newValue.length; i++) {
    if (newValue[i] && newValue[i] !== props.pair.english[i] && inputArray.value[i] !== newValue[i]) {
      errorCount.value++
    }
  }
  
  // Check if finished
  if (isFinished(newValue)) {
    emit('update:completed', true)
    // Focus next input field
    const nextInput = document.querySelector(`#input${props.index + 1}`)
    if (nextInput) {
      nextInput.focus()
    }
  }
}

// Watch for practice mode changes
watch(() => props.practiceMode, (newVal) => {
  if (!newVal) {
    input.value = ''
    inputArray.value = []
    errorCount.value = 0
  }
})
</script>

<style scoped>
.border-success {
  border-color: #10b981;
}

.border-warning {
  border-color: #f59e0b;
}

.border-danger {
  border-color: #ef4444;
}

.text-success {
  color: #10b981;
}

@keyframes correctPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes wrongShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

@keyframes checkmarkPop {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.animate-correctPulse {
  animation: correctPulse 0.3s ease-in-out;
}

.animate-wrongShake {
  animation: wrongShake 0.3s ease-in-out;
}

.animate-checkmarkPop {
  animation: checkmarkPop 0.3s ease-in-out;
}
</style>