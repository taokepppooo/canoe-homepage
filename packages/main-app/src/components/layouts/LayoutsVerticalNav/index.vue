<script setup lang="ts">
import { useNamespace } from '@/hooks/useNamespace'
import './src/layouts-vertical-nav.less'

const ns = useNamespace('layouts-vertical-nav')
</script>

<template>
  <div :class="ns.b()">
    <LayoutsVerticalNavList></LayoutsVerticalNavList>
  </div>
</template>
