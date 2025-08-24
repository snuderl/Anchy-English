<!--
  WordDisplay Component - Vocabulary Learning Input System

  SPECIFICATION:
  
  ## Character Input Behavior
  
  1. **Case-Insensitive Matching**:
     - Input "m" for target "M" → ✅ Accepted as correct
     - Input "M" for target "m" → ✅ Accepted as correct
     - Input case automatically corrected to match target case
  
  2. **Character Display**:
     - **Correct input**: Shows target character case (not input case)
     - **Wrong input**: Shows input character as typed
     - **Visual feedback**: Green border for correct, red border for wrong
  
  3. **Auto-Advance Behavior**:
     - **Any character entry** (correct OR wrong) → Auto-advance to next input box
     - **Continuous typing flow** without getting stuck on errors
     - **Backspace behavior**: Can delete and move back to previous boxes
  
  ## Word Completion Logic
  
  4. **Word Completion Check**:
     - Triggered after **every character input**
     - Word marked complete when **all characters are correct** (case-insensitive)
     - **Auto-advance to next word** when current word completed
     - **Progress tracking** updates immediately
  
  5. **Navigation Flow**:
     ```
     Character typed → Case corrected → Validation → Auto-advance → Check completion
     ```
  
  ## User Experience
  
  6. **Natural Typing**:
     - Users can type continuously without interruption
     - Wrong characters don't block progression
     - Immediate visual feedback on correctness
     - Proper capitalization automatically applied
  
  7. **Error Tolerance**:
     - Wrong characters advance cursor but show error state
     - Users can continue typing and correct later
     - Error count tracked for analytics
-->
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
          class="absolute bottom-4 left-0"
        >
          <input 
            v-if="practiceMode && !isCompleted"
            :id="`input-${props.index}-${index}`"
            v-model="inputArray[index]"
            type="text"
            maxlength="1"
            class="w-10 h-10 text-2xl font-medium text-center border-2 border-gray-300 rounded-md bg-gray-50 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            :class="getInputClass(index)"
            @input="handleCharacterInput(index, $event)"
            @keydown="handleKeyDown(index, $event)"
          />
          <div 
            v-else
            class="w-10 h-10 text-2xl font-medium border-2 border-gray-300 rounded-md bg-gray-50 transition-all duration-300 flex items-center justify-center"
            :class="getCharClass(index)"
          >
            {{ displayChar(index) }}
          </div>
        </div>
        
        <!-- Tall characters with ascenders (mapping == 1) -->
        <div 
          v-if="charMapping[char] === 1"
          class="absolute bottom-4 left-0"
        >
          <input 
            v-if="practiceMode && !isCompleted"
            :id="`input-${props.index}-${index}`"
            v-model="inputArray[index]"
            type="text"
            maxlength="1"
            class="w-10 h-14 text-2xl font-medium text-center border-2 border-gray-300 rounded-md bg-gray-50 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            :class="getInputClass(index)"
            @input="handleCharacterInput(index, $event)"
            @keydown="handleKeyDown(index, $event)"
          />
          <div 
            v-else
            class="w-10 h-14 text-2xl font-medium border-2 border-gray-300 rounded-md bg-gray-50 transition-all duration-300 flex items-center justify-center"
            :class="getCharClass(index)"
          >
            {{ displayChar(index) }}
          </div>
        </div>
        
        <!-- Characters with descenders (mapping == 2) -->
        <div 
          v-if="charMapping[char] === 2"
          class="absolute bottom-0 left-0"
        >
          <input 
            v-if="practiceMode && !isCompleted"
            :id="`input-${props.index}-${index}`"
            v-model="inputArray[index]"
            type="text"
            maxlength="1"
            class="w-10 h-14 text-2xl font-medium text-center border-2 border-gray-300 rounded-md bg-gray-50 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 pt-1"
            :class="getInputClass(index)"
            @input="handleCharacterInput(index, $event)"
            @keydown="handleKeyDown(index, $event)"
          />
          <div 
            v-else
            class="w-10 h-14 text-2xl font-medium border-2 border-gray-300 rounded-md bg-gray-50 transition-all duration-300 flex items-start justify-center pt-1"
            :class="getCharClass(index)"
          >
            {{ displayChar(index) }}
          </div>
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

const inputArray = ref([])
const errorCount = ref(0)
const validationStates = ref([])

const isCompleted = computed(() => props.completed)

function skip(char) {
  return char === ' ' || charMapping[char] === undefined
}

function showArrow(index) {
  return props.practiceMode && index === getCurrentInputPosition()
}

function getCurrentInputPosition() {
  for (let i = 0; i < inputArray.value.length; i++) {
    if (!inputArray.value[i] || validationStates.value[i] !== 'correct') {
      return i
    }
  }
  return inputArray.value.length
}

function displayChar(index) {
  if (props.showAnswer) {
    return props.pair.english[index]
  }
  if (props.practiceMode) {
    // Always show the target case when correct, preserve input when wrong
    if (validationStates.value[index] === 'correct') {
      return props.pair.english[index]
    }
    return inputArray.value[index] || ''
  }
  return ''
}

function getCharClass(index) {
  if (!props.practiceMode) return ''
  
  const validationState = validationStates.value[index]
  if (validationState === 'correct') {
    return 'border-success border-4 bg-green-100 text-green-800 animate-correctPulse'
  } else if (validationState === 'wrong') {
    return 'border-danger border-4 bg-red-100 text-red-800 animate-wrongShake'
  }
  
  return ''
}

function getInputClass(index) {
  const validationState = validationStates.value[index]
  if (validationState === 'correct') {
    return 'border-green-500 border-4 bg-green-100 text-green-800'
  } else if (validationState === 'wrong') {
    return 'border-red-500 border-4 bg-red-100 text-red-800'
  }
  
  return 'border-gray-300'
}

function isFinished() {
  const word = props.pair.english
  for (let i = 0; i < word.length; i++) {
    if (!inputArray.value[i] || inputArray.value[i].toLowerCase() !== word[i].toLowerCase()) {
      return false
    }
  }
  return true
}

function handleCharacterInput(index, event) {
  const value = event.target.value
  
  if (value) {
    const correctChar = props.pair.english[index]
    if (value.toLowerCase() === correctChar.toLowerCase()) {
      // Auto-correct the case to match the target character
      inputArray.value[index] = correctChar
      validationStates.value[index] = 'correct'
      
      // Update the input field to show the corrected case
      event.target.value = correctChar
    } else {
      inputArray.value[index] = value
      validationStates.value[index] = 'wrong'
      errorCount.value++
    }
    
    // Move to next input for any character entry (correct or wrong)
    if (index < props.pair.english.length - 1) {
      moveToNext(index)
    }
    
    // Always check if word is complete after any input
    setTimeout(() => {
      if (isFinished()) {
        emit('update:completed', true)
        focusNextWord()
      }
    }, 50)
  } else {
    inputArray.value[index] = value
    validationStates.value[index] = null
  }
}

function handleKeyDown(index, event) {
  const key = event.key
  
  if (key === 'ArrowRight' || (key !== 'Backspace' && inputArray.value[index] && key.length === 1)) {
    moveToNext(index)
  } else if (key === 'ArrowLeft') {
    moveToPrevious(index)
  } else if (key === 'Backspace') {
    if (!inputArray.value[index]) {
      // Current box is empty, delete previous character
      deletePreviousAndMoveTo(index)
      event.preventDefault()
    }
  } else if (key === 'Enter') {
    if (isFinished()) {
      emit('update:completed', true)
      focusNextWord()
    }
  }
}

function moveToNext(index) {
  if (index < props.pair.english.length - 1) {
    const nextInput = document.getElementById(`input-${props.index}-${index + 1}`)
    if (nextInput) {
      setTimeout(() => nextInput.focus(), 0)
    }
  }
}

function moveToPrevious(index) {
  if (index > 0) {
    const prevInput = document.getElementById(`input-${props.index}-${index - 1}`)
    if (prevInput) {
      setTimeout(() => prevInput.focus(), 0)
    }
  }
}

function deletePreviousAndMoveTo(index) {
  if (index > 0) {
    inputArray.value[index - 1] = ''
    validationStates.value[index - 1] = null
    moveToPrevious(index)
  }
}

function focusNextWord() {
  // Focus on the first input of the next word
  const nextWordIndex = props.index + 1
  const nextWordFirstInput = document.getElementById(`input-${nextWordIndex}-0`)
  if (nextWordFirstInput) {
    setTimeout(() => {
      nextWordFirstInput.focus()
    }, 100)
  }
}

// Watch for practice mode changes
watch(() => props.practiceMode, (newVal) => {
  if (!newVal) {
    inputArray.value = []
    validationStates.value = []
    errorCount.value = 0
  } else {
    // Initialize arrays for practice mode
    inputArray.value = new Array(props.pair.english.length).fill('')
    validationStates.value = new Array(props.pair.english.length).fill(null)
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