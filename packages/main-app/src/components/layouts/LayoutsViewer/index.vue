<script setup lang="ts">
import { useNamespace } from '@/hooks/useNamespace'
import './src/layouts-viewer.less'

const ns = useNamespace('layouts-viewer')
</script>

<template>
  <div :class="ns.b()">11113</div>
</template>
