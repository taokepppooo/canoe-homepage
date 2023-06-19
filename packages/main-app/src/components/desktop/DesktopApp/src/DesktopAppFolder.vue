<script setup lang="ts">
import { nextTick } from 'process'
import { useNamespace } from '@/hooks/useNamespace'
import { useDesktopGlobal } from '@/hooks/useGlobal'
import { useDesktopStore } from '@/stores/desktop'

const ns = useNamespace('desktop-app-folder')
const desktopStore = useDesktopStore()
const { appCSSConstant } = useDesktopGlobal()

const props = defineProps<{
  width: string
  height: string
}>()

const { width, height } = toRefs(props)
const appModalRef = ref()
const attrs = useAttrs()

const handleClick = () => {
  appModalRef.value.open()
}

watch(
  () => desktopStore.relatedId,
  () => {
    nextTick(() => {
      // 目标id与当前id相同，打开文件夹弹窗
      if (desktopStore.relatedId === attrs.id) {
        appModalRef.value.open()
      }
    })
  },
  {
    immediate: true
  }
)
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
