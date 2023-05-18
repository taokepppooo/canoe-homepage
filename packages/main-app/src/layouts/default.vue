<script setup lang="ts">
import { useNamespace } from '@/hooks/useNamespace'

const ns = useNamespace('layouts')
</script>

<template>
  <div :class="ns.b()">
    <LayoutsViewer />
  </div>
</template>

<style lang="less">
@ns: ~'@{namespace}-layouts';

.@{ns} {
  height: 100vh;
  background: url('https://cdn.dribbble.com/userupload/6903601/file/original-34da2d73df7ef84fcf35be4f456b0d87.png?compress=1&resize=1600x1280');
  background-size: cover;
}
</style>
