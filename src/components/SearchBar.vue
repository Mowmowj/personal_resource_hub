<template>
  <label class="flex w-full max-w-sm items-center gap-3 rounded-full border border-dusk/15 bg-white/80 px-4 py-2 shadow-sm">
    <span class="text-xs uppercase tracking-[0.35em] text-dusk/50">Search</span>
    <input
      class="w-full bg-transparent text-sm outline-none placeholder:text-dusk/50"
      type="text"
      :value="modelValue"
      placeholder="Search by title or tag"
      aria-label="Search by title or tag"
      @input="handleInput"
      @blur="emit('scroll-to-results')"
    />
  </label>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'scroll-to-results'): void
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
