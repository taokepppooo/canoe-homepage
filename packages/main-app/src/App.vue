<script setup lang="ts">
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import { setTheme } from '@/utils/theme'

setTheme('sky')

const locale = zhCn
</script>

<template>
  <ElConfigProvider :locale="locale">
    <RouterView />
  </ElConfigProvider>
</template>
