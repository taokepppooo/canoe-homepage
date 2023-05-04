<script setup lang="ts">
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

const locale = zhCn
</script>

<template>
  <ElConfigProvider :locale="locale">
    <BasicAppProvider>
      <RouterView />
    </BasicAppProvider>
  </ElConfigProvider>
</template>
