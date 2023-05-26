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
  background: url('https://www4.bing.com//th?id=OHR.SaksunFaroe_ZH-CN7150180006_UHD.jpg');
  background-size: cover;
}
</style>
