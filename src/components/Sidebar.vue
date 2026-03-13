<template>
  <div>
    <p class="mb-3 text-xs uppercase tracking-[0.35em] text-dusk/50">Categories</p>
    <ul class="space-y-2">
      <li v-for="category in categories" :key="category">
        <button
          class="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition"
          :class="
            category === activeCategory
              ? 'bg-ink text-sand'
              : 'bg-sand/70 text-ink hover:bg-clay/60'
          "
          @click="emit('select', category)"
        >
          <span>{{ category }}</span>
          <span class="text-xs opacity-70">›</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  categories: string[]
  activeCategory: string
}>()

const emit = defineEmits<{
  (event: 'select', category: string): void
}>()
</script>
