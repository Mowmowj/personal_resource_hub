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
      <SearchBar v-model="query" @scroll-to-results="scrollToResults" />
    </header>

    <!-- Layout: grid has max-height so sidebar and main can show internal scrollbars when content overflows. -->
    <div
      class="relative grid max-h-[calc(100vh-14rem)] min-h-0 gap-6 md:grid-cols-[240px_1fr]"
      :class="{
        'layout-reveal': layoutReveal,
        'layout-reveal-narrow': layoutRevealNarrow,
      }"
    >
      <aside
        class="flex min-h-0 w-full flex-col overflow-y-auto rounded-2xl bg-white/70 p-4 shadow-card md:w-[240px] md:min-w-[240px] md:max-w-[240px] md:shrink-0"
      >
        <Sidebar
          :categories="categories"
          :active-category="activeCategory"
          @select="handleCategorySelect"
        />
      </aside>

      <!-- overflow-auto: vertical and horizontal scrollbars when Resource Shelf content does not fit. -->
      <main
        ref="mainRef"
        class="min-h-0 min-w-0 overflow-auto rounded-2xl bg-white/80 p-6 shadow-card"
        role="region"
        aria-label="Resource Shelf"
      >
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold">Resource Shelf</h2>
            <p class="text-sm text-dusk/70">{{ filteredResources.length }} items</p>
          </div>
          <div class="text-xs uppercase tracking-[0.25em] text-dusk/50">{{ activeCategory }}</div>
        </div>

        <!-- Grid layout aligned with reference: predictable columns (2 at md, 3 at xl) and direct card placement. -->
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ResourceCard
            v-for="item in filteredResources"
            :key="item.id"
            :item="item"
            :active-category="activeCategory"
            :shelf-item-count="filteredResources.length"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import SearchBar from './components/SearchBar.vue'
import Sidebar from './components/Sidebar.vue'
import ResourceCard from './components/ResourceCard.vue'
import { mockResources } from './data/mockData'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { ResourceItem } from './types/resource'

const resources = ref<ResourceItem[]>(mockResources)
const mainRef = ref<HTMLElement | null>(null)

/** Scroll the Resource Shelf (main) into view when user finishes search input; links SearchBar with the results area. */
function scrollToResults() {
  mainRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Track desktop layout and trigger 0.5s reveal (blur/fade) when switching from narrow to desktop.
const MD_BREAKPOINT = 768
const isDesktop = ref(false)
const layoutReveal = ref(false)
const layoutRevealNarrow = ref(false)
let revealTimeout: ReturnType<typeof setTimeout> | null = null

function checkLayout() {
  const nowDesktop = window.innerWidth >= MD_BREAKPOINT
  if (nowDesktop && !isDesktop.value) {
    layoutReveal.value = true
    layoutRevealNarrow.value = false
    if (revealTimeout) clearTimeout(revealTimeout)
    revealTimeout = setTimeout(() => {
      layoutReveal.value = false
      revealTimeout = null
    }, 500)
  } else if (!nowDesktop && isDesktop.value) {
    layoutRevealNarrow.value = true
    layoutReveal.value = false
    if (revealTimeout) clearTimeout(revealTimeout)
    revealTimeout = setTimeout(() => {
      layoutRevealNarrow.value = false
      revealTimeout = null
    }, 500)
  }
  isDesktop.value = nowDesktop
}

onMounted(() => {
  checkLayout()
  window.addEventListener('resize', checkLayout)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkLayout)
  if (revealTimeout) clearTimeout(revealTimeout)
})

const query = ref('')

const { storedValue: persistedCategory } = useLocalStorage<string>('hub-category', 'All')
const activeCategory = ref(persistedCategory.value)

const categories = computed(() => {
  const base = new Set<string>()
  resources.value.forEach((item) => item.tags.forEach((tag) => base.add(tag)))
  return ['All', ...Array.from(base)]
})

// Use activeCategory.value inside computed so list updates when category changes (reactive).
// Apply both category filter and search query (title + tags), case-insensitive.
const filteredResources = computed(() => {
  const category = activeCategory.value
  const q = query.value.trim().toLowerCase()
  let list = category === 'All'
    ? resources.value
    : resources.value.filter((item) => item.tags.includes(category))
  if (q) {
    list = list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q)),
    )
  }
  return list
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
