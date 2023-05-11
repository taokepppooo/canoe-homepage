<script setup lang="ts">
import { useNamespace } from '@/hooks/useNamespace'
import { setTheme } from '@/utils/theme'
import './src/layouts-viewer.less'

const ns = useNamespace('layouts-viewer')

const handleSetTheme = (color: string) => {
  setTheme(color)
}
</script>

<template>
  <div :class="ns.b()">
    <ElButton @click="handleSetTheme('sky')">蓝</ElButton>
    <ElButton @click="handleSetTheme('lime')">黄</ElButton>
  </div>
</template>
