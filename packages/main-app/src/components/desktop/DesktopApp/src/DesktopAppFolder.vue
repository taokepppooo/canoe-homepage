<script setup lang="ts">
import { nextTick } from 'process'
import { useNamespace } from '@/hooks/useNamespace'
import { useDesktopGlobal } from '@/hooks/useGlobal'
import { useDesktopStore } from '@/stores/desktop'
import type { App } from '@/types/desktop'

const ns = useNamespace('desktop-app-folder')
const desktopStore = useDesktopStore()
const { appCSSConstant } = useDesktopGlobal()

const props = defineProps<{
  width: string
  height: string
}>()

const { width, height } = toRefs(props)
const app: Ref<App> | undefined = inject('app')
const appModalRef = ref()

const handleClick = () => {
  appModalRef.value.open({ openId: app?.value.id })
}

watch(
  () => desktopStore.dragStatus,
  () => {
    if (desktopStore.dragStatus === '2' && appModalRef.value) {
      nextTick(() => {
        appModalRef.value.open({ draggedId: desktopStore.draggedId })
      })
    }
  }
)
</script>

<template>
  <div :class="ns.b()" @click="handleClick"></div>
  <DesktopAppFolderModal
    v-if="desktopStore.relatedId === app?.id"
    ref="appModalRef"
  ></DesktopAppFolderModal>
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
  cursor: pointer;
}
</style>
