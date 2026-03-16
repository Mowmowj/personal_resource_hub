# Reflection

## Bug Fixes

### Filtering & search

- **Search not updating the list**  
  `filteredResources` did not use the search `query`, so the list did not change when typing. **Fix:** Use `query` in the computed: trim and lower-case, then filter by `title` or any `tags` (case-insensitive). List updates as the user types.

- **SearchBar not linked with results area**  
  No scroll to the Resource Shelf after search. **Fix:** SearchBar emits `scroll-to-results` on input blur; App.vue calls `scrollIntoView({ behavior: 'smooth', block: 'start' })` on the main ref so the shelf scrolls into view.

### Category & list reactivity

- **Category change not updating the list**  
  `filteredResources` used a one-time `const currentCategory = activeCategory.value`, so it never reacted to Sidebar clicks. **Fix:** Use `activeCategory.value` directly inside the computed so the list updates when the category changes.

- **ResourceCard not reflecting shelf state**  
  Cards had no access to the current filter or item count. **Fix:** Pass `active-category` and `shelf-item-count` to each ResourceCard. Cards highlight the matching tag and use a denser layout when `shelfItemCount` > 8.

### Layout, overflow & transitions

- **Main content compressed; sidebar width jumping on resize**  
  Main had no `min-w-0`; sidebar width was only implied by the grid. **Fix:** Add `min-w-0` to main. Give the sidebar on `md+` explicit `w-[240px] min-w-[240px] max-w-[240px] shrink-0` so it stays stable at 240px.

- **Main content breaking out at very narrow width (&lt; 240px)**  
  The card grid could force main to grow and overflow. **Fix:** Add `overflow-x-auto` on main and `min-w-0` on the inner grid so content scrolls horizontally instead of escaping.

- **No scrollbars when sidebar or shelf overflows**  
  Layout had no height limit or overflow handling. **Fix:** Grid container gets `max-h-[calc(100vh-14rem)]` and `min-h-0`. Aside and main get `overflow-y-auto` / `overflow-auto` and flex + `min-h-0` so scrollbars appear when content overflows.

- **Abrupt layout transitions at breakpoint**  
  Switching between narrow and desktop layout was instant. **Fix:** On narrow→desktop set `layoutReveal` (0.5s blur/fade); on desktop→narrow set `layoutRevealNarrow` with the same animation. One resize listener and one timeout, cleared on unmount.

### Resource Shelf grid & cards

- **Grid display and card sizing (evolution then simplified)**  
  Various iterations (auto-fill grid, per-card container for container queries, flex wrappers) led to inconsistent display and extra DOM. **Fix:** Align with reference layout: a single grid `grid gap-4 md:grid-cols-2 xl:grid-cols-3` with ResourceCard rendered directly (no wrapper per card). Still pass `active-category` and `shelf-item-count` so highlight and dense layout work. Result: predictable 2/3 columns, fewer nodes, no content escaping the grid.

- **ResourceCard content overflowing when width is small**  
  At narrow card width, title/description/tags/link could overflow and break out of the card. **Fix:** On the card root add `overflow-hidden`. On content blocks add `min-w-0` so flex children can shrink. On title and description add `break-words`. On the date row add `gap-2` and `shrink-0` on date and “Saved”. On the link add `min-w-0 max-w-full` and wrap label in `<span class="truncate">`. Content stays inside the card.

### Other

- **Type safety**  
  **Fix:** Extended `ResourceItem` with `tags: string[]` and `addedAt?: string` so mock data and components are fully typed.

- **Vue warn: scrollToResults not defined**  
  Handler was declared after lifecycle hooks so the template could reference it before definition. **Fix:** Move `mainRef` and `scrollToResults` to the top of the script (right after `resources`).

---

## Performance Improvements

### Methods

- **Filtering:** One `computed` for both category and search; recomputed only when `activeCategory`, `query`, or `resources` change. No duplicate iteration.
- **Layout:** `min-w-0` and fixed sidebar width keep reflows predictable; no layout thrashing from undefined min-widths.
- **Layout reveal:** Single resize listener, one timeout per transition, cleared in `onUnmounted`. Blur animation runs only when crossing narrow↔desktop.
- **Scrollbars:** CSS only (`max-h`, `overflow-auto` / `overflow-y-auto`, `min-h-0`). No ResizeObserver or JS for overflow.
- **Resource Shelf grid:** Simple breakpoint grid (`md:grid-cols-2 xl:grid-cols-3`), no per-card wrappers or container queries. Fewer DOM nodes and simpler layout.
- **ResourceCard:** Dense layout and tag highlight are derived from props (computed); no extra re-renders beyond filtering. Overflow handled with CSS (`overflow-hidden`, `min-w-0`, `break-words`, `truncate`) so no JS or resize logic.

### Tradeoffs

- **Search:** No debounce for instant feedback with the current list size; for very large lists, a short debounce would reduce work per keystroke at the cost of a slight delay.
- **Resize listener:** No throttle; for heavy resize usage, throttling would reduce work with slightly delayed transition detection.
- **Grid columns:** Fixed at 2 (md) and 3 (xl); extra-wide viewports still show 3 columns instead of scaling.
- **Scrollbar height:** `14rem` offset is tuned for the current header; it may need updating if the header height changes.
- **Dense threshold:** `DENSE_THRESHOLD = 8` is fixed; for much larger lists a higher value or container-based density could be used.
