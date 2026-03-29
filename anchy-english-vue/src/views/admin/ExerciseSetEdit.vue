<template>
  <div class="max-w-5xl mx-auto p-8">
    <div v-if="loading" class="text-center py-8">
      <p class="text-xl text-gray-600 dark:text-gray-400">Nalagam...</p>
    </div>

    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        {{ isNew ? 'Nov nabor vaj' : `Uredi: ${form.name}` }}
      </h1>

      <!-- Exercise Set Details -->
      <div class="space-y-4 mb-8">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ime</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ime nabora vaj"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Opis</label>
          <input
            v-model="form.description"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Kratek opis"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategorije (ločene z vejico)</label>
          <input
            v-model="categoriesInput"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="npr. Daily Life, Travel"
          />
        </div>
      </div>

      <!-- Exercises -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Vaje ({{ form.exercises.length }})
          </h2>
          <button
            @click="addExercise"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
          >
            + Dodaj vajo
          </button>
        </div>

        <div v-if="form.exercises.length === 0" class="text-center py-6 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          Še ni vaj. Klikni "+ Dodaj vajo" za začetek.
        </div>

        <div class="space-y-4">
          <div
            v-for="(exercise, index) in form.exercises"
            :key="exercise._key"
            class="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
          >
            <div class="flex items-start justify-between mb-3">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">#{{ index + 1 }}</span>
              <button
                @click="removeExercise(index)"
                class="text-red-500 hover:text-red-700 text-sm"
              >
                Odstrani
              </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="md:col-span-2">
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Stavek (uporabi _____ za prazno mesto)
                </label>
                <input
                  v-model="exercise.sentence_template"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="She _____ her teeth before breakfast."
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Manjkajoča beseda (odgovor)</label>
                <input
                  v-model="exercise.missing_word"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="brushes"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Slovenski namig</label>
                <input
                  v-model="exercise.slovene_hint"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="umije"
                />
              </div>
            </div>
            <!-- Preview -->
            <div v-if="exercise.sentence_template && exercise.sentence_template.includes('_____')" class="mt-3 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm text-gray-600 dark:text-gray-300">
              Predogled: {{ exercise.sentence_template.replace('_____', `[${exercise.missing_word || '???'}]`) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <button
          @click="save"
          :disabled="saving"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200 font-medium"
        >
          {{ saving ? 'Shranjujem...' : 'Shrani' }}
        </button>
        <router-link
          to="/admin/exercise-sets"
          class="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200 font-medium"
        >
          Prekliči
        </router-link>
        <button
          v-if="!isNew"
          @click="handleDelete"
          class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium ml-auto"
        >
          Izbriši
        </button>
      </div>

      <!-- Messages -->
      <div v-if="message" class="mt-4 p-4 rounded-md" :class="messageClass">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getExerciseSet, saveExerciseSet, deleteExerciseSet, saveExercise, deleteExercise } from '@/api/exerciseSets'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const saving = ref(false)
const message = ref('')
const messageType = ref('')

let keyCounter = 0

const form = ref({
  name: '',
  description: '',
  exercises: []
})
const categoriesInput = ref('')

const isNew = computed(() => !route.params.id)

const messageClass = computed(() =>
  messageType.value === 'success'
    ? 'bg-green-100 text-green-700 border border-green-300'
    : 'bg-red-100 text-red-700 border border-red-300'
)

function addExercise() {
  form.value.exercises.push({
    _key: ++keyCounter,
    id: null,
    sentence_template: '',
    missing_word: '',
    slovene_hint: '',
  })
}

function removeExercise(index) {
  form.value.exercises.splice(index, 1)
}

async function loadData() {
  if (isNew.value) return
  loading.value = true
  try {
    const data = await getExerciseSet(route.params.id)
    form.value.name = data.name
    form.value.description = data.description || ''
    form.value.exercises = (data.exercises || []).map(ex => ({
      _key: ++keyCounter,
      id: ex.id,
      sentence_template: ex.sentence_template,
      missing_word: ex.missing_word,
      slovene_hint: ex.slovene_hint || '',
    }))
    categoriesInput.value = (data.categories || []).map(c => c.name).join(', ')
  } catch (error) {
    showMessage('Napaka pri nalaganju: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

async function save() {
  if (!form.value.name.trim()) {
    showMessage('Ime je obvezno', 'error')
    return
  }

  saving.value = true
  try {
    const categories = categoriesInput.value
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    // Save the exercise set
    const result = await saveExerciseSet(route.params.id, {
      name: form.value.name,
      description: form.value.description || null,
      categories,
    })
    const setId = route.params.id || result.id

    // Save each exercise
    const existingIds = new Set()
    for (const exercise of form.value.exercises) {
      if (!exercise.sentence_template.trim() || !exercise.missing_word.trim()) continue
      const res = await saveExercise(exercise.id, {
        sentence_template: exercise.sentence_template,
        missing_word: exercise.missing_word,
        slovene_hint: exercise.slovene_hint || null,
        exercise_set_id: setId,
      })
      existingIds.add(exercise.id || res.id)
    }

    // Delete removed exercises (ones that were loaded but no longer in the list)
    if (!isNew.value) {
      const original = await getExerciseSet(setId)
      for (const ex of original.exercises) {
        if (!existingIds.has(ex.id)) {
          await deleteExercise(ex.id)
        }
      }
    }

    showMessage('Uspešno shranjeno!', 'success')
    if (isNew.value) {
      router.push(`/admin/exercise-sets/${setId}`)
    } else {
      await loadData()
    }
  } catch (error) {
    showMessage('Napaka pri shranjevanju: ' + error.message, 'error')
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!confirm(`Izbriši nabor vaj "${form.value.name}" in vse njegove vaje?`)) return
  try {
    await deleteExerciseSet(route.params.id)
    router.push('/admin/exercise-sets')
  } catch (error) {
    showMessage('Napaka pri brisanju: ' + error.message, 'error')
  }
}

function showMessage(text, type) {
  message.value = text
  messageType.value = type
  setTimeout(() => { message.value = '' }, 5000)
}

onMounted(loadData)
</script>
