<script setup lang="ts">
import { useNamespace } from '@/hooks/useNamespace'
import './layouts-vertical-nav-list-item.less'
import { layoutNavProps } from './props'
import type { Trigger, LayoutNav } from './types'

const ns = useNamespace('layouts-vertical-nav-list-item')
const iconRef = ref()

const props = defineProps(layoutNavProps)

const { item, activeDefault } = toRefs(props)

const active = ref(false)
const activeIndex = ref<string | undefined>(activeDefault.value)
const activeClass = computed(() => (active.value ? ns.em('icon', 'active') : null))
const trigger = ref<Trigger>()
const emit = defineEmits<{
  (e: 'clearActive', item: LayoutNav | undefined): void
}>()

const handleClick = () => {
  if (trigger.value === 'hover') {
    emit('clearActive', item?.value)

    active.value = true
    trigger.value = 'select'
    activeIndex.value = item?.value?._index
  }
}
const handleMouseEnter = () => {
  if (!active.value) {
    active.value = true
    trigger.value = 'hover'
  }
}
const handleMouseLeave = () => {
  if (trigger.value === 'hover') {
    active.value = false
    trigger.value = 'hover-out'
  }
}
</script>

<template>
  <div @click="handleClick" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <ElTooltip :content="item?.toolContent" placement="right">
      <div ref="iconRef" :class="[ns.e('icon'), activeClass]">
        <Icon :icon="item?.icon" :size="16"></Icon>
      </div>
    </ElTooltip>
  </div>
</template>
