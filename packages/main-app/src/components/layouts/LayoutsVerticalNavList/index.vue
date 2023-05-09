<script setup lang="ts">
import { useNamespace } from '@/hooks/useNamespace'
import Item from './src/item.vue'
import type { LayoutNav } from './src/types'

import '~/theme/nav.less'
import './src/layouts-vertical-nav-list.less'

const ns = useNamespace('layouts-vertical-nav-list')

const nav = ref<LayoutNav[]>([
  {
    _index: '0',
    toolContent: 'Right Center prompts info',
    icon: 'ep:close'
  },
  {
    _index: '1',
    toolContent: 'Right Center prompts info',
    icon: 'ep:close'
  },
  {
    _index: '2',
    toolContent: 'Right Center prompts info',
    icon: 'ep:close'
  },
  {
    _index: '3',
    toolContent: 'Right Center prompts info',
    icon: 'ep:close'
  }
])

const handleTrigger = (activeItem: LayoutNav | undefined, targetActiveItem: LayoutNav) => {
  console.log(activeItem)
  console.log(targetActiveItem)
}
</script>

<template>
  <ul :class="ns.b()">
    <li v-for="(item, index) in nav" :key="index">
      <Item
        :item="item"
        @clear-active="(activeItem: LayoutNav | undefined) => handleTrigger(activeItem, item)"
      ></Item>
    </li>
  </ul>
</template>
