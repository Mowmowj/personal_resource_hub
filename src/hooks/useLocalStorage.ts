import { ref, watch } from 'vue'

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const storedValue = ref(initialValue)

  const storedRaw = localStorage.getItem(key)
  if (storedRaw) {
    try {
      storedValue.value = JSON.parse(storedRaw) as T
    } catch (error) {
      console.warn('Failed to parse localStorage value', error)
    }
  }

  watch(
    storedValue,
    (value) => {
      // TODO: handle serialization errors for complex data.
      localStorage.setItem(key, JSON.stringify(value))
    },
    { deep: true },
  )

  return {
    storedValue,
  }
}
