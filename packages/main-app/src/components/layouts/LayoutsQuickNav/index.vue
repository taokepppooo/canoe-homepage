<script setup lang="ts">
import { useNamespace } from '@/hooks/useNamespace'

const ns = useNamespace('layouts-quick-nav')
</script>

<template>
  <div :class="ns.b()">
    <div :class="ns.b('operate')"></div>
  </div>
</template>

<style lang="less">
@ns: ~'@{namespace}-layouts-quick-nav';

.@{ns} {
  position: absolute;
  bottom: 0;
  width: 100vw;

  &-operate {
    width: 80%;
    height: 70px;
    margin: 0 auto;
    background-color: var(--primary-nav-bg);
    backdrop-filter: blur(10px);
    border-radius: 8px;
  }
}
</style>
