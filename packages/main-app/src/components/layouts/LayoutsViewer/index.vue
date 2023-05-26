<script setup lang="ts">
import SearchEngine from '@/views/searchEngine/index.vue'
import Desktop from '@/views/desktop/index.vue'
import QuickNav from '@/views/quickNav/index.vue'
import { useNamespace } from '@/hooks/useNamespace'
import { calcElementHeight } from '@/utils/dom'
import { useLayoutStore } from '@/stores/layout'

const ns = useNamespace('layouts-viewer')
const layoutStore = useLayoutStore()

const searchEngineRef = ref()
const quickNavRef = ref()

nextTick(() => {
  layoutStore.noDesktopLayoutHeight =
    calcElementHeight(searchEngineRef.value.$el) + calcElementHeight(quickNavRef.value.$el)
})
</script>

<template>
  <div :class="ns.b()">
    <SearchEngine ref="searchEngineRef" />
    <Desktop />
    <QuickNav ref="quickNavRef" />
  </div>
</template>

<style lang="less">
@ns: ~'@{namespace}-layouts-viewer';
</style>
