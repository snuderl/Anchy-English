import { ref } from 'vue'
import { getWords, searchWords as searchWordsApi } from '@/api/words'

export function useWords() {
  const words = ref([])
  const dictionary = ref({})
  const loading = ref(false)
  const error = ref(null)
  
  async function loadWords() {
    loading.value = true
    try {
      const data = await getWords()
      words.value = data
      
      // Build dictionary for quick lookup
      dictionary.value = {}
      for (const word of data) {
        dictionary.value[word.english] = word
      }
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }
  
  async function searchWords(query) {
    if (!query || query.length < 2) {
      return []
    }
    
    try {
      return await searchWordsApi(query)
    } catch (e) {
      console.error('Search error:', e)
      // Fallback to local search if API fails
      return words.value.filter(w => 
        w.english.toLowerCase().includes(query.toLowerCase())
      )
    }
  }
  
  return {
    words,
    dictionary,
    loading,
    error,
    loadWords,
    searchWords
  }
}