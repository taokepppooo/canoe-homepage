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
  width: 100%;
  background: url('https://th.bing.com/th/id/R.1e9cdfa1145f629462d906b9d1f2dd5c?rik=paiVwLyXEcouzg&riu=http%3a%2f%2fdata.znds.com%2fattachment%2fforum%2f201507%2f25%2f141327t7pbozz7flx7dtp3.jpg&ehk=%2bvr8ZRqoSJltFV1pOHoHrERjTFGPHVZNQ7rP5nGbdGM%3d&risl=&pid=ImgRaw&r=0');
  background-size: cover;
}
</style>
