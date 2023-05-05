<script setup lang="ts">
import { Icon as IconifyIcon } from '@iconify/vue'
import { useNamespace } from '@/hooks/useNamespace'
import { iconProps } from './src/props'

const ns = useNamespace('layouts-vertical-nav-list')

const props = defineProps(iconProps)

const { icon, size } = toRefs(props)
</script>

<template>
  <IconifyIcon v-if="icon" :class="ns.b()" :icon="icon" :height="size" :width="size" />
</template>
