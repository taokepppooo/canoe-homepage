<script setup lang="ts">
import { nextTick } from 'process'
import { useNamespace } from '@/hooks/useNamespace'
import { useDesktopGlobal } from '@/hooks/useGlobal'
import { useDesktopStore } from '@/stores/desktop'
import { useDesktopAppStore } from '@/stores/desktopApp'
import type { App } from '@/types/desktop'

const ns = useNamespace('desktop-app-folder')
const desktopStore = useDesktopStore()
const desktopAppStore = useDesktopAppStore()
const { appCSSConstant } = useDesktopGlobal()

const props = defineProps<{
  width: string
  height: string
}>()

const { width, height } = toRefs(props)
const app: Ref<App> | undefined = inject('app')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const appModalRef = ref<{ [key: string]: any }>({})

const setOpenFolder = (id = '') => {
  const desktopList = desktopAppStore.desktopList
  const currentDesktopIndex = desktopStore.currentDesktop.index as number
  desktopStore.openFolder.id = id
  if (currentDesktopIndex >= 0) {
    desktopStore.openFolder.index = desktopList[currentDesktopIndex].child?.findIndex(
      (item) => item.id === id
    )
  }
}

const handleClick = () => {
  setOpenFolder(app?.value.id)
  nextTick(() => {
    app?.value.id && appModalRef.value[app?.value.id].open()
  })
}

watch(
  () => desktopStore.dragStatus,
  () => {
    if (desktopStore.dragStatus === '2' && appModalRef.value) {
      // 清除合并时未在弹窗之前合理清除的问题
      desktopStore.dragStatus = '0'
      setOpenFolder(desktopStore.related.id)
      app?.value.id && appModalRef.value[app?.value.id].open({ draggedId: desktopStore.dragged.id })
    }
  }
)
</script>

<template>
  <div :class="ns.b()" @click="handleClick"></div>
  <DesktopAppFolderModal
    :ref="(el: HTMLElement) => (appModalRef[app!.id] = el)"
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
