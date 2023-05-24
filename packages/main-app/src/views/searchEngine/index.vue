<script setup lang="ts">
import { useNamespace } from '@/hooks/useNamespace'

const ns = useNamespace('search-engine')
</script>

<template>
  <div :class="ns.b()"></div>
</template>

<style lang="less">
@ns: ~'@{namespace}-search-engine';

.@{ns} {
  height: 200px;
}
</style>
