<template>
  <div class="flex min-h-0 flex-col">
    <p class="mb-3 shrink-0 text-xs uppercase tracking-[0.35em] text-dusk/50">Categories</p>
    <!-- Scrollable category list when it overflows (e.g. many categories). -->
    <ul class="min-h-0 space-y-2 overflow-y-auto">
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
