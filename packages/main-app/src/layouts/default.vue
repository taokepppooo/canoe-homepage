<script setup lang="ts">
import { useNamespace } from '@/hooks/useNamespace'
import '~/comp/layouts.less'

const ns = useNamespace('layouts')
</script>

<template>
  <div :class="ns.b()">
    <LayoutsVerticalNav></LayoutsVerticalNav>
    <LayoutsViewer></LayoutsViewer>
  </div>
</template>
