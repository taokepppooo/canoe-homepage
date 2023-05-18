<script setup lang="ts">
import { useNamespace } from '@/hooks/useNamespace'

const ns = useNamespace('desktop')
</script>

<template>
  <div :class="ns.b()">
    <div></div>
    <div></div>
  </div>
</template>

<style lang="less">
@ns: ~'@{namespace}-desktop';

.@{ns} {
  width: 100vw;
}
</style>
