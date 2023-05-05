<script setup lang="ts">
import { useNamespace } from '@/hooks/useNamespace'
import '~/comp/layouts-vertical-nav-list.less'

const ns = useNamespace('layouts-vertical-nav-list')

const list = ref([
  {
    toolContent: 'Right Center prompts info',
    icon: 'ep:close',
    size: 10
  },
  {
    toolContent: 'Right Center prompts info',
    icon: 'ep:close',
    size: 10
  },
  {
    toolContent: 'Right Center prompts info',
    icon: 'ep:close',
    size: 10
  },
  {
    toolContent: 'Right Center prompts info',
    icon: 'ep:close',
    size: 10
  }
])
</script>

<template>
  <ul :class="ns.b()">
    <li v-for="(l, index) in list" :key="index" :class="ns.e('item')">
      <ElTooltip :content="l.toolContent" placement="right">
        <Icon :icon="l.icon" :size="l.size"></Icon>
      </ElTooltip>
    </li>
  </ul>
</template>
