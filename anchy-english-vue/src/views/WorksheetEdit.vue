<template>
  <div>
    <br><br>
    <!-- View Mode -->
    <div v-if="!editMode" class="max-w-5xl mx-auto p-8 bg-gray-50 rounded-xl shadow-lg">
      <form role="form">
        <div class="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-lg mb-10">
          <h1 class="text-4xl font-semibold m-0">{{ worksheet.ime }}</h1>
        </div>
        
        <!-- Progress bar for practice mode -->
        <div v-if="practiceMode" class="bg-white p-6 rounded-lg mb-8 shadow-sm">
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
                :practiceMode="practiceMode"
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
        <div v-if="isFinished" class="text-center p-12 bg-gradient-to-r from-primary to-secondary text-white rounded-xl mt-10 animate-slideInUp">
          <div class="text-7xl mb-6 animate-bounce">🎉</div>
          <h1 class="text-5xl mb-4">Čestitke, uspelo ti je!</h1>
          <p class="text-xl">Odlično delo! Uspešno si rešil vse besede.</p>
        </div>
        
        <!-- Confetti Animation -->
        <ConfettiAnimation 
          :active="showConfetti" 
          @finished="onConfettiFinished"
        />

        <!-- Action buttons -->
        <div v-if="!practiceMode" class="inline-flex rounded-md shadow-sm mt-8" role="group">
          <button type="button" class="px-6 py-3 text-lg font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700" 
            @click="toggleAnswers">
            Answers
          </button>
          <button type="button" class="px-6 py-3 text-lg font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
            @click="print">
            Print
          </button>
          <button type="button" class="px-6 py-3 text-lg font-medium text-gray-900 bg-white border-t border-b border-l border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
            @click="edit">
            Urejaj
          </button>
          <button type="button" class="px-6 py-3 text-lg font-medium text-gray-900 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
            @click="startPractice">
            Resuj
          </button>
        </div>
      </form>
    </div>

    <!-- Edit Mode -->
    <div v-if="editMode" class="max-w-5xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <form role="form">
          <fieldset class="mb-8">
            <legend class="text-2xl font-semibold text-gray-800 mb-5">Učni list</legend>
          </fieldset>

          <div class="mb-6">
            <label class="block text-lg font-medium text-gray-700 mb-2" for="naslov">Naslov: </label>
            <input 
              v-model="worksheet.ime"
              class="w-full px-4 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              type="text" 
              id="naslov" 
              placeholder="Naslov delovnega lista"
            />
          </div>

          <fieldset class="mb-8">
            <legend class="text-2xl font-semibold text-gray-800 mb-5">Besede</legend>
          </fieldset>
          
          <div class="mb-8">
            <div v-for="(pair, index) in worksheet.words" :key="index" class="grid grid-cols-2 gap-4 mb-3">
              <label class="text-gray-700 font-medium text-lg">{{ pair.slovene }}</label>
              <div class="flex items-center justify-between">
                <span class="text-gray-900 text-lg">{{ pair.english }}</span>
                <a href="#" @click.prevent="removeWord(index)" class="text-red-500 hover:text-red-700">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <fieldset class="mb-8">
            <legend class="text-2xl font-semibold text-gray-800 mb-5">Dodaj besedo</legend>
          </fieldset>
          
          <div class="mb-5">
            <label class="block text-lg font-medium text-gray-700 mb-2" for="english-word">English: </label>
            <WordAutocomplete 
              v-model="word"
              field="english"
              :words="words"
              placeholder="English word"
            />
          </div>
          
          <div class="mb-5">
            <label class="block text-lg font-medium text-gray-700 mb-2" for="slovene-word">Slovene: </label>
            <input 
              v-model="word.slovene"
              type="text" 
              class="w-full px-4 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              id="slovene-word"
              placeholder="Slovene translation"
            />
          </div>

          <div class="text-center mb-8">
            <button 
              type="button" 
              class="px-6 py-3 text-lg bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
              :disabled="!canAddWord"
              @click="addWord"
            >
              Dodaj
            </button>
          </div>

          <fieldset class="mb-8">
            <legend class="text-2xl font-semibold text-gray-800 mb-5">Kategorije</legend>
          </fieldset>
          
          <div class="mb-8">
            <div v-for="(category, index) in worksheet.categories" :key="index" class="flex items-center justify-between mb-3">
              <span class="text-gray-900 text-lg">{{ category.name }}</span>
              <a href="#" @click.prevent="removeCategory(index)" class="text-red-500 hover:text-red-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </a>
            </div>
          </div>

          <fieldset class="mb-8">
            <legend class="text-2xl font-semibold text-gray-800 mb-5">Dodaj kategorijo</legend>
          </fieldset>
          
          <div class="mb-8">
            <label class="block text-lg font-medium text-gray-700 mb-2">Ime</label>
            <div class="flex gap-3">
              <CategoryAutocomplete 
                v-model="category"
                :categories="categories"
                class="flex-1"
              />
              <button 
                type="button" 
                class="px-6 py-3 text-lg bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                @click="addCategory"
                :disabled="!category.name"
              >
                Dodaj
              </button>
            </div>
          </div>

          <fieldset class="mb-8">
            <legend class="text-2xl font-semibold text-gray-800 mb-5">Komande</legend>
          </fieldset>
          
          <div class="text-center">
            <div class="inline-flex rounded-md shadow-sm" role="group">
              <button 
                type="button" 
                class="px-6 py-3 text-lg font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
                @click="save"
              >
                Shrani
              </button>
              <button 
                type="button" 
                class="px-6 py-3 text-lg font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
                @click="cancel"
              >
                Prekini
              </button>
              <button 
                v-if="worksheet.id"
                type="button" 
                class="px-6 py-3 text-lg font-medium text-white bg-red-600 border border-red-600 rounded-r-lg hover:bg-red-700 focus:z-10 focus:ring-2 focus:ring-red-500 focus:text-white"
                @click="deleteWorksheet"
              >
                Izbrisi
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWorksheet } from '@/composables/useWorksheet'
import { useWords } from '@/composables/useWords'
import { getCategories } from '@/api/categories'
import { deleteWorksheet as deleteWorksheetApi } from '@/api/worksheets'
import WordDisplay from '@/components/WordDisplay.vue'
import WordAutocomplete from '@/components/WordAutocomplete.vue'
import CategoryAutocomplete from '@/components/CategoryAutocomplete.vue'
import ConfettiAnimation from '@/components/ConfettiAnimation.vue'

const route = useRoute()
const router = useRouter()
const { worksheet, loadWorksheet, saveWorksheet } = useWorksheet()
const { words, dictionary, loadWords } = useWords()

const editMode = ref(false)
const showAnswers = ref(true)
const practiceMode = ref(false)
const completed = ref([])
const categories = ref([])
const showConfetti = ref(false)

const word = ref({
  english: '',
  slovene: ''
})

const category = ref({
  name: ''
})

const completedCount = computed(() => 
  completed.value.filter(Boolean).length
)

const progressPercentage = computed(() => {
  if (!worksheet.value || !worksheet.value.words || worksheet.value.words.length === 0) {
    return 0
  }
  return Math.round((completedCount.value / worksheet.value.words.length) * 100)
})

const isFinished = computed(() => {
  const finished = practiceMode.value && completedCount.value === worksheet.value.words.length
  if (finished && !showConfetti.value) {
    showConfetti.value = true
  }
  return finished
})

const canAddWord = computed(() => {
  return word.value.english !== '' && word.value.slovene !== ''
})

const canSave = computed(() => {
  return !!worksheet.value.ime && worksheet.value.words.length > 0
})

function toggleAnswers() {
  showAnswers.value = !showAnswers.value
}

function print() {
  router.push({ query: { mode: 'print' } })
}

function edit() {
  editMode.value = true
}

function cancel() {
  editMode.value = false
}

function startPractice() {
  practiceMode.value = true
  showAnswers.value = false
  completed.value = new Array(worksheet.value.words.length).fill(false)
  showConfetti.value = false
  router.push({ query: { mode: 'resuj' } })
}

function onConfettiFinished() {
  showConfetti.value = false
}

function addWord() {
  if (!canAddWord.value) return
  
  if (!dictionary.value[word.value.english]) {
    dictionary.value[word.value.english] = word.value
  }
  
  worksheet.value.words.push({ ...word.value })
  
  word.value = {
    english: '',
    slovene: ''
  }
}

function removeWord(index) {
  worksheet.value.words.splice(index, 1)
}

function addCategory() {
  if (!category.value.name) return
  worksheet.value.categories.push({ ...category.value })
  category.value = { name: '' }
}

function removeCategory(index) {
  worksheet.value.categories.splice(index, 1)
}

async function save() {
  if (!canSave.value) return
  
  try {
    const result = await saveWorksheet()
    if (!worksheet.value.id && result.id) {
      router.push(`/admin/worksheets/${result.id}`)
    } else {
      editMode.value = false
    }
  } catch (error) {
    console.error('Failed to save worksheet:', error)
  }
}

async function deleteWorksheet() {
  if (!worksheet.value.id) return
  
  if (confirm('Ste prepričani da želite izbrisati delovni list?')) {
    try {
      await deleteWorksheetApi(worksheet.value.id)
      router.push('/admin/worksheets')
    } catch (error) {
      console.error('Failed to delete worksheet:', error)
    }
  }
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

async function loadData() {
  const [categoriesData] = await Promise.all([
    getCategories(),
    loadWords()
  ])
  categories.value = categoriesData
  
  if (route.params.id) {
    await loadWorksheet(route.params.id)
  } else {
    editMode.value = true
    worksheet.value = {
      ime: '',
      words: [],
      categories: []
    }
  }
  
  if (route.query.mode === 'print') {
    showAnswers.value = false
    window.print()
  } else if (route.query.mode === 'resuj') {
    practiceMode.value = true
    showAnswers.value = false
    completed.value = new Array(worksheet.value.words.length).fill(false)
    showConfetti.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>