<script setup lang="ts">
import { useNamespace } from '@/hooks/useNamespace'
import './layouts-vertical-nav-list-item.less'
import type { Trigger, LayoutNav } from './types'

const ns = useNamespace('layouts-vertical-nav-list-item')
const iconRef = ref()

const props = defineProps<{
  item: LayoutNav
}>()

const { item } = toRefs(props)

const activeClass = computed(() => (item.value._active ? ns.em('icon', 'active') : null))
const trigger = ref<Trigger>()
const emit = defineEmits<{
  (e: 'toActive', item: LayoutNav): void
  (e: 'active', index: string, active: boolean): void
}>()

const handleClick = () => {
  if (trigger.value === 'hover') {
    trigger.value = 'select'

    emit('toActive', item.value)
    emit('active', item.value._index, true)
  }
}
const handleMouseEnter = () => {
  if (!item.value._active) {
    trigger.value = 'hover'

    emit('active', item.value._index, true)
  }
}
const handleMouseLeave = () => {
  if (trigger.value === 'hover') {
    trigger.value = 'hover-out'

    emit('active', item.value._index, false)
  }
}
</script>

<template>
  <div @click="handleClick" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <ElTooltip :content="item?.toolContent" placement="right">
      <div ref="iconRef" :class="[ns.e('icon'), activeClass]">
        <Icon :icon="item.icon" :size="16"></Icon>
      </div>
    </ElTooltip>
  </div>
</template>
