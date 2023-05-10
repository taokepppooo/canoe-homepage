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
    _active: false,
    toolContent: 'Right Center prompts info',
    icon: 'ep:close'
  },
  {
    _index: '1',
    _active: false,
    toolContent: 'Right Center prompts info',
    icon: 'ep:close'
  },
  {
    _index: '2',
    _active: false,
    toolContent: 'Right Center prompts info',
    icon: 'ep:close'
  },
  {
    _index: '3',
    _active: false,
    toolContent: 'Right Center prompts info',
    icon: 'ep:close'
  }
])

const activeIndex = ref<string>('')
const handleToActive = (activeItem: LayoutNav) => {
  if (activeIndex.value) {
    // TODO 需要将索引改成唯一值
    nav.value[Number(activeIndex.value)]._active = false
  }

  activeIndex.value = activeItem._index
}
const handleActive = (index: string, active: boolean) => {
  if (activeIndex.value) {
    // TODO 需要将索引改成唯一值
    nav.value[Number(index)]._active = active
  }
}
</script>

<template>
  <ul :class="ns.b()">
    <li v-for="(item, index) in nav" :key="index">
      <Item
        :item="item"
        @to-active="(activeItem) => handleToActive(activeItem)"
        @active="handleActive"
      ></Item>
    </li>
  </ul>
</template>
