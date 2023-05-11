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
    icon: 'ion:cloud'
  },
  {
    _index: '1',
    _active: false,
    toolContent: 'Right Center prompts info',
    icon: 'ion:cloud'
  },
  {
    _index: '2',
    _active: false,
    toolContent: 'Right Center prompts info',
    icon: 'ion:cloud'
  },
  {
    _index: '3',
    _active: false,
    toolContent: 'Right Center prompts info',
    icon: 'ion:cloud'
  }
])

const activeIndex = ref<string>('')
const handleClickActive = (activeItem: LayoutNav) => {
  // TODO: 需要将索引改成唯一值
  nav.value[Number(activeItem._index)]._active = true

  if (activeIndex.value) {
    // TODO: 需要将索引改成唯一值
    nav.value[Number(activeIndex.value)]._active = false
  }

  activeIndex.value = activeItem._index
}
const handleHoverActive = (index: string, active: boolean) => {
  // TODO: 需要将索引改成唯一值
  nav.value[Number(index)]._active = active
}
</script>

<template>
  <ul :class="ns.b()">
    <li v-for="(item, index) in nav" :key="index">
      <Item
        :item="item"
        @click-active="(activeItem) => handleClickActive(activeItem)"
        @hover-active="handleHoverActive"
      ></Item>
    </li>
  </ul>
</template>
