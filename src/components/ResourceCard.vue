<template>
  <article
    class="resource-card fade-in group flex h-full w-full min-w-0 flex-col justify-between overflow-hidden rounded-2xl border border-dusk/10 bg-white transition-[padding,font-size]"
    :class="[isDense ? 'p-3' : 'p-4']"
  >
    <div class="min-w-0">
      <div class="flex min-w-0 items-center justify-between gap-2">
        <p
          class="resource-card-date shrink-0 uppercase tracking-[0.3em] text-dusk/50"
          :class="isDense ? 'text-[10px]' : 'text-xs'"
        >
          {{ item.addedAt }}
        </p>
        <span class="shrink-0 rounded-full bg-ember/15 px-2 py-1 text-xs text-ember">Saved</span>
      </div>
      <h3
        class="resource-card-title break-words font-semibold text-ink"
        :class="isDense ? 'mt-2 text-base' : 'mt-3 text-lg'"
      >
        {{ item.title }}
      </h3>
      <p
        class="resource-card-desc break-words text-dusk/80"
        :class="isDense ? 'mt-1.5 text-xs' : 'mt-2 text-sm'"
      >
        {{ item.description || 'Curated resource for your learning backlog.' }}
      </p>
    </div>
    <div class="resource-card-tags flex min-w-0 flex-wrap gap-2" :class="isDense ? 'mt-3' : 'mt-4'">
      <span
        v-for="tag in item.tags"
        :key="tag"
        class="rounded-full px-3 py-1 text-xs transition-colors"
        :class="
          activeCategory && tag === activeCategory
            ? 'bg-ink text-sand font-medium'
            : 'bg-sand text-dusk/70'
        "
      >
        #{{ tag }}
      </span>
    </div>
    <a
      class="resource-card-link inline-flex min-w-0 max-w-full items-center font-medium text-moss transition group-hover:translate-x-1"
      :class="isDense ? 'mt-3 text-xs' : 'mt-4 text-sm'"
      :href="item.url"
      target="_blank"
      rel="noreferrer"
    >
      <span class="truncate">Open resource →</span>
    </a>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ResourceItem } from '../types/resource'

const props = withDefaults(
  defineProps<{
    item: ResourceItem
    /** Current shelf filter from App header; card highlights the matching tag when set. */
    activeCategory?: string
    /** Number of items in the shelf; when high, card uses a denser layout. */
    shelfItemCount?: number
  }>(),
  { activeCategory: '', shelfItemCount: 0 },
)

/** Dense layout when shelf shows many items so cards scale with Resource Shelf header state. */
const DENSE_THRESHOLD = 8
const isDense = computed(() => (props.shelfItemCount ?? 0) > DENSE_THRESHOLD)
</script>

<style scoped>
/* Auto-adjust to grid cell size: when the container (44–57) is narrow, card stays compact; when wide, use relaxed spacing. */
@container card-cell (min-width: 20rem) {
  .resource-card {
    padding: 1rem;
  }
  .resource-card .resource-card-date {
    font-size: 0.75rem;
  }
  .resource-card .resource-card-title {
    margin-top: 0.75rem;
    font-size: 1.125rem;
  }
  .resource-card .resource-card-desc {
    margin-top: 0.5rem;
    font-size: 0.875rem;
  }
  .resource-card .resource-card-tags {
    margin-top: 1rem;
  }
  .resource-card .resource-card-link {
    margin-top: 1rem;
    font-size: 0.875rem;
  }
}
</style>
