<script setup lang="ts">
import { useNamespace } from '@/hooks/useNamespace'

const ns = useNamespace('desktop')
</script>

<template>
  <div :class="ns.b()">
    <DesktopController> </DesktopController>
  </div>
</template>

<style lang="less">
@ns: ~'@{namespace}-desktop';
</style>
