<script setup lang="ts">
import { useNamespace } from '@/hooks/useNamespace'
import { useDesktopGlobal } from '@/hooks/useGlobal'

const props = defineProps<{
  width: string
  height: string
}>()

const { width, height } = toRefs(props)

const ns = useNamespace('desktop-app-folder')
const { appCSSConstant } = useDesktopGlobal()
</script>

<template>
  <div :class="ns.b()"></div>
</template>

<style lang="less">
@ns: ~'@{namespace}-desktop-app-folder';

.@{ns} {
  width: v-bind(width);
  height: v-bind(height);
  overflow: hidden;
  border-radius: v-bind('appCSSConstant.borderRadius');
  box-shadow: 0 0 10px #00000026;
}
</style>
