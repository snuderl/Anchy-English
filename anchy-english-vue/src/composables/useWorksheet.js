import { ref } from 'vue'
import { getWorksheet, updateWorksheet, createWorksheet } from '@/api/worksheets'

export function useWorksheet() {
  const worksheet = ref({
    ime: '',
    words: [],
    categories: []
  })
  
  const loading = ref(false)
  const error = ref(null)
  
  async function loadWorksheet(id) {
    loading.value = true
    try {
      worksheet.value = await getWorksheet(id)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }
  
  async function saveWorksheet() {
    loading.value = true
    try {
      if (worksheet.value.id) {
        await updateWorksheet(worksheet.value.id, worksheet.value)
      } else {
        const result = await createWorksheet(worksheet.value)
        worksheet.value = result
      }
      return worksheet.value
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }
  
  return {
    worksheet,
    loading,
    error,
    loadWorksheet,
    saveWorksheet
  }
}