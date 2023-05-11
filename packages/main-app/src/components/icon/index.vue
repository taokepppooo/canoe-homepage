<script setup lang="ts">
import { Icon as IconifyIcon } from '@iconify/vue'
import { useNamespace } from '@/hooks/useNamespace'

const ns = useNamespace('layouts-vertical-nav-list')

const props = defineProps<{
  icon: string
  size: number | string
}>()

const { icon, size } = toRefs(props)
</script>

<template>
  <IconifyIcon :class="ns.b()" :icon="icon" :height="size" :width="size" />
</template>
