<script setup lang="ts">
import { useNamespace } from '@/hooks/useNamespace'
import { useDesktopGlobal } from '@/hooks/useGlobal'

const ns = useNamespace('desktop-app-folder')
const { appCSSConstant } = useDesktopGlobal()

const props = defineProps<{
  width: string
  height: string
}>()

const { width, height } = toRefs(props)
const appModalRef = ref()

const handleClick = () => {
  appModalRef.value.open()
}

provide('openFolderModal', handleClick)
</script>

<template>
  <div>
    <div :class="ns.b()" @click="handleClick"></div>
    <DesktopAppFolderModal ref="appModalRef"></DesktopAppFolderModal>
  </div>
</template>

<style lang="less">
@ns: ~'@{namespace}-desktop-app-folder';

.@{ns} {
  width: v-bind(width);
  height: v-bind(height);
  backdrop-filter: blur(10px);
  overflow: hidden;
  border-radius: v-bind('appCSSConstant.borderRadius');
  box-shadow: 0 0 10px #00000026;
}
</style>
