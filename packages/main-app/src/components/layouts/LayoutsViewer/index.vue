<script setup lang="ts">
import SearchEngine from '@/views/searchEngine/index.vue'
import Desktop from '@/views/desktop/index.vue'
import QuickNav from '@/views/quickNav/index.vue'
import { useNamespace } from '@/hooks/useNamespace'

const ns = useNamespace('layouts-viewer')
</script>

<template>
  <div :class="ns.b()">
    <SearchEngine />
    <Desktop />
    <QuickNav />
  </div>
</template>

<style lang="less">
@ns: ~'@{namespace}-layouts-viewer';
</style>
