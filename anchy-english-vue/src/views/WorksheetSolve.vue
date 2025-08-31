<template>
  <div>
    <PublicHeader />
    <br><br>
    <div class="max-w-5xl mx-auto p-8 bg-gray-50 rounded-xl shadow-lg">
      <form role="form">
        <div class="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-lg mb-10">
          <h1 class="text-4xl font-semibold m-0">{{ worksheet.ime }}</h1>
        </div>
        
        <!-- Progress bar -->
        <div class="bg-white p-6 rounded-lg mb-8 shadow-sm">
          <div class="text-gray-700 mb-5 font-medium text-xl">
            Rešenih {{ completedCount }} od {{ worksheet.words.length }} besed.
          </div>
          <div class="w-full bg-gray-200 rounded-full h-12 overflow-hidden shadow-inner">
            <div 
              class="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full font-semibold text-lg leading-[3rem] text-white text-center shadow-md transition-all duration-500 ease-out" 
              role="progressbar" 
              :aria-valuenow="progressPercentage" 
              aria-valuemin="0" 
              aria-valuemax="100" 
              :style="`width: ${progressPercentage}%; min-width: 2em;`"
            >
              {{ progressPercentage }}%
            </div>
          </div>
        </div>
        
        <!-- Word exercises -->
        <div class="space-y-6">
          <div 
            v-for="(pair, index) in worksheet.words" 
            :key="index"
            class="bg-white p-7 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div class="inline-block min-w-[200px] text-2xl font-semibold text-gray-800 mr-6 mb-5">
              {{ pair.slovene }}
            </div>
            <div class="inline-flex items-center gap-3">
              <WordDisplay 
                v-model:completed="completed[index]"
                :pair="pair"
                :showAnswer="showAnswers"
                :practiceMode="true"
                :index="index"
              />
              <button 
                @click="speakWord(pair.english)"
                class="flex-shrink-0 w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 ml-2"
                title="Play English pronunciation"
                type="button"
              >
                🔊
              </button>
            </div>
          </div>
        </div>
        
        <!-- Success message -->
        <div v-if="allCompleted" class="mt-10 text-center">
          <ConfettiAnimation />
          <div class="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg text-xl font-semibold">
            🎉 Čestitamo! Rešili ste vse besede! 🎉
          </div>
          <div class="mt-6 space-x-4">
            <button 
              @click="resetWorksheet" 
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-lg font-medium"
            >
              Ponovi
            </button>
            <router-link 
              to="/" 
              class="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-lg font-medium"
            >
              Nazaj na seznam
            </router-link>
          </div>
        </div>
        
        <!-- Control buttons -->
        <div class="mt-10 flex justify-center space-x-4">
          <button 
            v-if="!allCompleted"
            type="button" 
            class="px-6 py-3 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            @click="showAnswers = !showAnswers"
          >
            {{ showAnswers ? 'Skrij odgovore' : 'Prikaži odgovore' }}
          </button>
          <button 
            v-if="!allCompleted"
            type="button" 
            class="px-6 py-3 text-lg bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
            @click="resetWorksheet"
          >
            Ponovi
          </button>
          <router-link 
            to="/" 
            class="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-lg font-medium"
          >
            Nazaj na seznam
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getWorksheet } from '@/api/worksheets'
import WordDisplay from '@/components/WordDisplay.vue'
import ConfettiAnimation from '@/components/ConfettiAnimation.vue'
import PublicHeader from '@/components/PublicHeader.vue'

const route = useRoute()

const worksheet = ref({
  ime: '',
  words: []
})

const completed = ref([])
const showAnswers = ref(false)
const loading = ref(false)

const completedCount = computed(() => {
  return completed.value.filter(Boolean).length
})

const progressPercentage = computed(() => {
  if (worksheet.value.words.length === 0) return 0
  return Math.round((completedCount.value / worksheet.value.words.length) * 100)
})

const allCompleted = computed(() => {
  return worksheet.value.words.length > 0 && completedCount.value === worksheet.value.words.length
})

async function loadWorksheet() {
  loading.value = true
  try {
    const data = await getWorksheet(route.params.id)
    worksheet.value = data
    completed.value = new Array(data.words.length).fill(false)
  } catch (error) {
    console.error('Failed to load worksheet:', error)
  } finally {
    loading.value = false
  }
}

function resetWorksheet() {
  completed.value = new Array(worksheet.value.words.length).fill(false)
  showAnswers.value = false
}

function speakWord(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.8
    speechSynthesis.speak(utterance)
  } else {
    console.warn('Speech synthesis not supported in this browser')
  }
}

onMounted(() => {
  loadWorksheet()
})
</script>