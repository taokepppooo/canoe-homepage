<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { useNamespace } from '@/hooks/useNamespace'
import Item from './src/item.vue'
import type { LayoutNav } from './src/types'

const ns = useNamespace('layouts-vertical-nav-list')

const nav = ref<LayoutNav[]>([
  {
    _uuid: uuidv4(),
    toolContent: 'Right Center prompts info',
    icon: 'ion:cloud'
  },
  {
    _uuid: uuidv4(),
    toolContent: 'Right Center prompts info',
    icon: 'ion:cloud'
  },
  {
    _uuid: uuidv4(),
    toolContent: 'Right Center prompts info',
    icon: 'ion:cloud'
  },
  {
    _uuid: uuidv4(),
    toolContent: 'Right Center prompts info',
    icon: 'ion:cloud'
  },
  {
    _uuid: uuidv4(),
    toolContent: 'Right Center prompts info',
    icon: 'ion:cloud'
  },
  {
    _uuid: uuidv4(),
    toolContent: 'Right Center prompts info',
    icon: 'ion:cloud'
  }
])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const itemRefs = ref<{ [key: string]: any }>({})
const activeOffset = ref('0')
const itemWidth = ref('32px')
const itemHeight = ref('32px')
const itemMargin = ref('3px')
const activeIndex = ref<string>(nav.value[0]._uuid)

const handleClickActive = (activeItem: LayoutNav) => {
  activeIndex.value = activeItem._uuid
}

watch(activeIndex, (newV, oldV) => {
  if (newV && newV !== oldV) {
    const index: number = nav.value.findIndex((item) => item._uuid === newV)

    if (index > -1) {
      const __offsetNumber = parseInt(activeOffset.value)

      const __height = parseInt(itemHeight.value) + parseInt(itemMargin.value)
      const __offset: number = index * __height - __offsetNumber
      let __targetOffset = __offsetNumber
      __targetOffset += __offset

      activeOffset.value = `${__targetOffset}px`
    }
  }
})
</script>

<template>
  <div :class="ns.b()">
    <ul :class="ns.b('wrapper')">
      <li v-for="item in nav" :key="item._uuid">
        <Item
          :ref="(el) => (itemRefs[item._uuid] = el)"
          :item="item"
          :item-width="itemWidth"
          :item-height="itemHeight"
          :item-margin="itemMargin"
          :active-index="activeIndex"
          @click-active="(activeItem) => handleClickActive(activeItem)"
        ></Item>
      </li>
    </ul>

    <div v-show="activeIndex" :class="ns.b('active-bg')"></div>
  </div>
</template>

<style lang="less">
@ns: ~'@{namespace}-layouts-vertical-nav-list';

.@{ns} {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  &-wrapper {
    position: relative;
    z-index: 9;
  }

  &-active-bg {
    position: absolute;
    z-index: 1;
    width: v-bind(itemWidth);
    height: v-bind(itemHeight);
    margin: v-bind(itemMargin);
    border-radius: 5px;
    background-color: var(--primary-nav-icon-active-bg);
    transform: translateY(v-bind(activeOffset));
    transition: transform 1s;
  }
}
</style>
