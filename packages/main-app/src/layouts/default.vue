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
  background: url('https://media.discordapp.net/attachments/945077390839787570/1120261039792078870/cb23_The_calm_waters_flat_vector_art_anime_high_quality_8k_desk_265d7168-d72c-4e73-a496-cc9455d70f12.png?width=1181&height=662');
  background-size: cover;
}
</style>
