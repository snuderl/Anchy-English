<template>
  <div>
    <PublicHeader />

    <div class="max-w-3xl mx-auto p-4 sm:p-8">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-12 text-gray-500 dark:text-gray-400 text-xl">
        Nalagam...
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-500 text-xl mb-4">{{ error }}</p>
        <router-link to="/word-practice" class="text-blue-600 hover:underline">← Nazaj na delovne liste</router-link>
      </div>

      <!-- Setup Screen -->
      <div v-else-if="gamePhase === 'setup'" class="text-center">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-6">
          <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">🎮 Igra povezovanja</h1>
          <p class="text-xl text-gray-600 dark:text-gray-400 mb-1">{{ worksheet.ime }}</p>
          <p class="text-gray-500 dark:text-gray-500 mb-6">{{ worksheet.words.length }} besed na voljo</p>

          <div class="mb-6">
            <p class="text-gray-700 dark:text-gray-300 font-medium mb-3">Izberi težavnost:</p>
            <div class="flex justify-center gap-4">
              <button
                v-for="opt in difficultyOptions"
                :key="opt.count"
                :class="[
                  'px-6 py-3 rounded-lg font-semibold transition-all duration-200 border-2',
                  selectedDifficulty === opt.count
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400'
                ]"
                @click="selectedDifficulty = opt.count"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <button
            class="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg rounded-lg transition-colors duration-200"
            @click="handleStart"
          >
            Začni
          </button>
        </div>

        <router-link to="/word-practice" class="text-blue-600 hover:underline dark:text-blue-400">
          ← Nazaj na delovne liste
        </router-link>
      </div>

      <!-- Playing / Completed Screen -->
      <div v-else>
        <!-- Stats bar -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <time class="text-2xl font-mono font-bold text-gray-800 dark:text-gray-100" aria-live="off">
              {{ formatTime(elapsedTime) }}
            </time>
            <div class="flex items-center gap-4 flex-wrap">
              <span class="text-gray-600 dark:text-gray-400 font-medium">
                ✅ {{ matchedPairs }} / {{ totalPairs }} parov
              </span>
              <span class="text-gray-600 dark:text-gray-400 font-medium">
                ❌ {{ mistakes }} napak
              </span>
              <StreakCounter :streak="streak" :best="bestStreak" label="zapored" />
            </div>
          </div>
        </div>

        <!-- Game board -->
        <div v-if="gamePhase === 'playing'" class="grid grid-cols-2 gap-4 sm:gap-6">
          <!-- English column -->
          <div class="space-y-3">
            <h2 class="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Angleško</h2>
            <div v-for="card in englishCards" :key="'en-' + card.id" :class="{ hidden: card.matched }">
              <MatchCard
                :text="card.text"
                :column="card.column"
                :matched="card.matched"
                :match-state="card.matchState"
                @select="selectCard(card)"
              />
            </div>
          </div>

          <!-- Slovene column -->
          <div class="space-y-3">
            <h2 class="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Slovensko</h2>
            <div v-for="card in sloveneCards" :key="'sl-' + card.id" :class="{ hidden: card.matched }">
              <MatchCard
                :text="card.text"
                :column="card.column"
                :matched="card.matched"
                :match-state="card.matchState"
                @select="selectCard(card)"
              />
            </div>
          </div>
        </div>

        <!-- Completion Screen -->
        <div v-if="gamePhase === 'completed'" class="text-center">
          <ConfettiAnimation :active="showConfetti" />

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
            <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">🎉 Odlično!</h2>

            <div class="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8 text-lg">
              <div class="text-right text-gray-500 dark:text-gray-400">⏱️ Čas:</div>
              <div class="text-left font-semibold text-gray-800 dark:text-gray-100">{{ formatTime(elapsedTime) }}</div>

              <div class="text-right text-gray-500 dark:text-gray-400">✅ Pari:</div>
              <div class="text-left font-semibold text-gray-800 dark:text-gray-100">{{ matchedPairs }}</div>

              <div class="text-right text-gray-500 dark:text-gray-400">❌ Napake:</div>
              <div class="text-left font-semibold text-gray-800 dark:text-gray-100">{{ mistakes }}</div>

              <div class="text-right text-gray-500 dark:text-gray-400">🔥 Najboljši zapored:</div>
              <div class="text-left font-semibold text-gray-800 dark:text-gray-100">{{ bestStreak }}</div>

              <div class="text-right text-gray-500 dark:text-gray-400">⭐ Ocena:</div>
              <div class="text-left font-semibold text-2xl">{{ '⭐'.repeat(starRating) }}</div>
            </div>

            <div class="flex flex-wrap justify-center gap-3">
              <button
                class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200"
                @click="handlePlayAgain"
              >
                Igraj znova
              </button>
              <button
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                @click="handleNewDifficulty"
              >
                Nova težavnost
              </button>
              <router-link
                to="/word-practice"
                class="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Nazaj na delovne liste
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getWorksheet } from '@/api/worksheets'
import { useMatchGame } from '@/composables/useMatchGame'
import { formatTime } from '@/utils/gameUtils'
import PublicHeader from '@/components/PublicHeader.vue'
import MatchCard from '@/components/MatchCard.vue'
import StreakCounter from '@/components/StreakCounter.vue'
import ConfettiAnimation from '@/components/ConfettiAnimation.vue'

const route = useRoute()

const worksheet = ref({ ime: '', words: [] })
const loading = ref(true)
const error = ref(null)
const selectedDifficulty = ref(6)
const showConfetti = ref(false)

const difficultyOptions = [
  { label: '6 parov (Lahko)', count: 6 },
  { label: '8 parov (Srednje)', count: 8 },
  { label: '10 parov (Težko)', count: 10 },
]

const {
  gamePhase,
  englishCards,
  sloveneCards,
  matchedPairs,
  totalPairs,
  mistakes,
  streak,
  bestStreak,
  elapsedTime,
  starRating,
  startGame,
  selectCard,
  restart,
  setWords,
  cleanup,
} = useMatchGame([], 0)

async function loadWorksheet() {
  loading.value = true
  error.value = null
  try {
    const data = await getWorksheet(route.params.id)
    worksheet.value = data
    setWords(data.words, selectedDifficulty.value)
  } catch (e) {
    error.value = 'Napaka pri nalaganju delovnega lista'
    console.error(e)
  } finally {
    loading.value = false
  }
}

function handleStart() {
  setWords(worksheet.value.words, selectedDifficulty.value)
  startGame()
}

function handlePlayAgain() {
  showConfetti.value = false
  restart()
  setWords(worksheet.value.words, selectedDifficulty.value)
  startGame()
}

function handleNewDifficulty() {
  showConfetti.value = false
  restart()
}

watch(gamePhase, (phase) => {
  if (phase === 'completed') {
    showConfetti.value = true
  }
})

onMounted(() => {
  loadWorksheet()
})

onUnmounted(() => {
  cleanup()
})
</script>
