<template>
  <article class="fade-in group flex h-full flex-col justify-between rounded-2xl border border-dusk/10 bg-white p-4">
    <div>
      <div class="flex items-center justify-between">
        <p class="text-xs uppercase tracking-[0.3em] text-dusk/50">{{ item.addedAt }}</p>
        <span class="rounded-full bg-ember/15 px-2 py-1 text-xs text-ember">Saved</span>
      </div>
      <h3 class="mt-3 text-lg font-semibold text-ink">{{ item.title }}</h3>
      <p class="mt-2 text-sm text-dusk/80">
        {{ item.description || 'Curated resource for your learning backlog.' }}
      </p>
    </div>
    <div class="mt-4 flex flex-wrap gap-2">
      <span
        v-for="tag in item.tags"
        :key="tag"
        class="rounded-full bg-sand px-3 py-1 text-xs text-dusk/70"
      >
        #{{ tag }}
      </span>
    </div>
    <a
      class="mt-4 inline-flex items-center text-sm font-medium text-moss transition group-hover:translate-x-1"
      :href="item.url"
      target="_blank"
      rel="noreferrer"
    >
      Open resource →
    </a>
  </article>
</template>

<script setup lang="ts">
import type { ResourceItem } from '../types/resource'

defineProps<{
  item: ResourceItem
}>()
</script>
