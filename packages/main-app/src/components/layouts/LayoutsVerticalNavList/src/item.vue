<script setup lang="ts">
import { useNamespace } from '@/hooks/useNamespace'
import type { Trigger, LayoutNav } from './types'

const ns = useNamespace('layouts-vertical-nav-list-item')

const props = defineProps<{
  item: LayoutNav
  activeIndex: string
  itemWidth: string
  itemHeight: string
  itemMargin: string
}>()

const { item, activeIndex, itemWidth, itemHeight, itemMargin } = toRefs(props)
const trigger = ref<Trigger>('select')
const emit = defineEmits<{
  (e: 'click-active', item: LayoutNav): void
}>()

const hoverClass = computed(() =>
  trigger.value === 'hover' ||
  (trigger.value === 'select' && activeIndex.value === item.value._uuid)
    ? ns.em('icon', 'active')
    : null
)

const handleClick = () => {
  if (trigger.value === 'hover') {
    trigger.value = 'select'

    emit('click-active', item.value)
  }
}
const handleMouseEnter = () => {
  if (activeIndex.value !== item.value._uuid) {
    trigger.value = 'hover'
  }
}
const handleMouseLeave = () => {
  if (trigger.value === 'hover') {
    trigger.value = 'hover-out'
  }
}
</script>

<template>
  <div
    :class="ns.b()"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <ElTooltip
      :content="item?.toolContent"
      :popper-class="ns.e('popper')"
      placement="right"
      effect="customized"
    >
      <div :class="[ns.e('icon'), hoverClass]">
        <Icon :icon="item.icon" :size="15"></Icon>
      </div>
    </ElTooltip>
  </div>
</template>

<style lang="less">
@ns: ~'@{namespace}-layouts-vertical-nav-list-item';

.@{ns} {
  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-nav-icon-color);
    width: v-bind(itemWidth);
    height: v-bind(itemHeight);
    margin: v-bind(itemMargin);
    border-radius: 5px;

    &--active {
      color: var(--primary-nav-icon-active-color);
      transition: color 1s;
    }
  }

  &__popper {
    color: var(--primary-nav-icon-active-color);
    background-color: var(--primary-nav-bg);
    backdrop-filter: blur(10px);

    .el-popper__arrow::before {
      display: none;
    }
  }
}
</style>
