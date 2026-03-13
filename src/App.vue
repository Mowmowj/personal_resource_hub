<template>
  <div class="min-h-screen px-6 py-8 md:px-10">
    <header class="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 class="text-3xl font-semibold text-ink md:text-4xl">Personal Resource Hub</h1>
        <p class="mt-2 max-w-2xl text-sm text-dusk/80">
          A curated dashboard for articles, tools, and references. Keep it intentionally small,
          fast, and actionable.
        </p>
      </div>
      <SearchBar v-model="query" />
    </header>

    <div class="relative grid gap-6 md:grid-cols-[240px_1fr]">
      <aside class="rounded-2xl bg-white/70 p-4 shadow-card">
        <Sidebar
          :categories="categories"
          :active-category="activeCategory"
          @select="handleCategorySelect"
        />
      </aside>

      <main class="rounded-2xl bg-white/80 p-6 shadow-card">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold">Resource Shelf</h2>
            <p class="text-sm text-dusk/70">{{ filteredResources.length }} items</p>
          </div>
          <div class="text-xs uppercase tracking-[0.25em] text-dusk/50">{{ activeCategory }}</div>
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ResourceCard v-for="item in filteredResources" :key="item.id" :item="item" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import SearchBar from './components/SearchBar.vue'
import Sidebar from './components/Sidebar.vue'
import ResourceCard from './components/ResourceCard.vue'
import { mockResources } from './data/mockData'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { ResourceItem } from './types/resource'

const resources = ref<ResourceItem[]>(mockResources)
const query = ref('')

const { storedValue: persistedCategory } = useLocalStorage<string>('hub-category', 'All')
const activeCategory = ref(persistedCategory.value)

const categories = computed(() => {
  const base = new Set<string>()
  resources.value.forEach((item) => item.tags.forEach((tag) => base.add(tag)))
  return ['All', ...Array.from(base)]
})

const currentCategory = activeCategory.value
const filteredResources = computed(() => {
  if (currentCategory === 'All') {
    return resources.value
  }
  return resources.value.filter((item) => item.tags.includes(currentCategory))
})

const handleCategorySelect = (category: string) => {
  activeCategory.value = category
  persistedCategory.value = category
}

watchEffect(() => {
  if (!categories.value.includes(activeCategory.value)) {
    activeCategory.value = 'All'
  }
})
</script>
