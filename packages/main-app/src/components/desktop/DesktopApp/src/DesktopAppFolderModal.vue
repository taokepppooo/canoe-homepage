<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { debounce } from 'lodash-es'
import { useNamespace } from '@/hooks/useNamespace'
import { useDesktopSortable } from '@/hooks/desktop/useDesktopSortable'
import { useDesktopAppFolderModalTimerOutside } from '@/hooks/desktopApp/useDesktopAppFolderModal'
import { useDesktopGlobal } from '@/hooks/useGlobal'
import { useDesktopStore } from '@/stores/desktop'
import { useDesktopAppStore } from '@/stores/desktopApp'
import { useDesktopAppFolderModalStore } from '@/stores/desktopAppFolderModal'
import type { App } from '@/types/desktop'

interface OpenProps {
  draggedId?: string
  openFolderId?: string
}

const ns = useNamespace('desktop-folder-modal')
const { appCSSConstant, appSize } = useDesktopGlobal()
const desktopStore = useDesktopStore()
const desktopAppStore = useDesktopAppStore()
const desktopAppFolderModalStore = useDesktopAppFolderModalStore()

const desktopRef = ref()
const appsRef = ref()
const bodyRef = ref()
const visible = ref(false)
const desktopHeight = ref('auto')
const apps = ref()

const currentDesktopIndex = computed(() => desktopStore.currentDesktop.index as number)
const desktopList = computed(() => desktopAppStore.desktopList)
const openFolder = computed(() => desktopStore.openFolder)
const desktop = computed(() => desktopList.value[currentDesktopIndex.value].child)
const related = computed(() => desktopStore.related)
const relatedIndex = computed(() => desktopStore.related.index as number)
const isTimerOutside = ref(false)

watchEffect(() => {
  if (isTimerOutside.value && desktopStore.openFolder.isOpen) {
    nextTick(() => {
      handleClose()
    })
  }
})

const createChildFolder = (app: App, isFolder = false) => {
  if (!app.child) {
    app.child = {
      name: '文件夹',
      value: []
    }

    app.child.value.push({
      id: uuidv4(),
      parentId: app.id,
      title: app.title,
      img: app.img,
      isFolder
    })
  }
}

const setupSortable = (app: App) => {
  nextTick(() => {
    const element = appsRef.value

    app.child &&
      useDesktopSortable({
        element,
        list: app.child?.value,
        options: {
          group: 'desktop'
        }
      })
  })
}

const open = ({ draggedId, openFolderId }: OpenProps = {}) => {
  isTimerOutside.value = useDesktopAppFolderModalTimerOutside(bodyRef).isTimerOutside.value
  isTimerOutside.value = false
  visible.value = true

  if (draggedId) {
    setData()
    setOpenFolder(related.value.id)
  } else {
    setOpenFolder(openFolderId)
    const openIdex = openFolder.value.index
    apps.value = desktop.value[openIdex as number]
  }

  apps.value.title = apps.value.child.name

  setupSortable(apps.value)
}

const setData = () => {
  apps.value = desktopList.value[related.value.desktopIndex as number].child[relatedIndex.value]
  createChildFolder(apps.value)
}

const setOpenFolder = (id = '') => {
  const desktopList = desktopAppStore.desktopList
  const currentDesktopIndex = desktopStore.currentDesktop.index as number
  desktopStore.openFolder.id = id
  desktopStore.openFolder.isOpen = true
  if (currentDesktopIndex >= 0) {
    desktopStore.openFolder.index = desktopList[currentDesktopIndex].child?.findIndex(
      (item) => item.id === id
    )
    desktopStore.openFolder.desktopIndex = currentDesktopIndex
  }
}

const folderNameInput = (e: Event) => {
  if (currentDesktopIndex.value >= 0) {
    const app = reactive(desktop.value[openFolder.value.index as number])
    app.child &&
      (apps.value.child.name = app.title = app.child.name = (e.target as HTMLInputElement).value)
  }
}

const debounceFolderNameInput = debounce(folderNameInput, 300)

const gridStyles = ref({
  display: 'grid',
  'grid-template-columns': `repeat(auto-fill, ${appSize.value.width})`,
  'grid-template-rows': `repeat(auto-fill, ${appSize.value.height})`,
  'grid-gap': `${appCSSConstant.value.gridGapY} ${appCSSConstant.value.gridGapX}`
})

const handleClose = () => {
  visible.value = false
  desktopStore.openFolder.isOpen = false
  desktopAppFolderModalStore.isFirstMergeOpen = false
}

defineExpose({
  open
})
</script>

<template>
  <ElDialog
    v-model="visible"
    :class="ns.b()"
    :show-close="false"
    width="50%"
    append-to-body
    align-center
    close-on-press-escape
    destroy-on-close
    @close="handleClose"
  >
    <template #header>
      <div :class="ns.b('header')">
        <input
          :value="apps.child?.name"
          :class="ns.be('header', 'title')"
          @input="debounceFolderNameInput"
        />
      </div>
    </template>
    <div ref="bodyRef" :class="ns.b('body')">
      <div ref="desktopRef" :class="ns.be('body', 'desktop')" :style="{ height: desktopHeight }">
        <div ref="appsRef" :class="ns.be('body__desktop', 'apps')" :style="gridStyles">
          <DesktopApp
            v-for="app in apps.child?.value"
            :key="app.id"
            :app="app"
            :gap-rows="1"
            :gap-columns="1"
          />
        </div>
      </div>
    </div>
  </ElDialog>
</template>

<style lang="less">
@import url('~/global/common.less');
@ns: ~'@{namespace}-desktop-folder-modal';

.@{ns} {
  background-color: var(--primary-icon-folder-body-bg);
  backdrop-filter: blur(10px);
  border-radius: 20px;

  .el-dialog__header {
    position: absolute;
    top: -70px;
    left: 50%;
    width: 210px;
    transform: translateX(-50%);
    text-align: center;
  }

  &-header {
    &__title {
      text-align: center;
      color: var(--primary-color);
      background: initial;
      font-size: 18px;
      line-height: 36px;
      padding: 2px 10px;
      border-radius: 8px;
      text-shadow: 3px 3px 3px rgb(0 0 0 / 80%);

      &:hover,
      &:focus {
        background-color: var(--primary-icon-folder-title-bg);
        backdrop-filter: blur(10px);
        transition: background-color 0.5s;
      }
    }
  }

  .el-dialog__body {
    padding: 0;
  }

  &-body {
    /* 此处样式和el-dialog__body相同，处理拖拽时范围的判断 */
    padding: calc(var(--el-dialog-padding-primary) + 10px) var(--el-dialog-padding-primary);

    &__desktop {
      margin: 0 auto;

      &__apps {
        justify-content: center;
        user-select: none;
      }
    }
  }
}
</style>
