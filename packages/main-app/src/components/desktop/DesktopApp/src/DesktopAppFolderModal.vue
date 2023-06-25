<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { useNamespace } from '@/hooks/useNamespace'
import { useDesktopSortable } from '@/hooks/desktop/useDesktop'
import { useDesktopGlobal } from '@/hooks/useGlobal'
import { useDesktopStore } from '@/stores/desktop'

const ns = useNamespace('desktop-folder-modal')
const { appCSSConstant, appSize } = useDesktopGlobal()
const desktopStore = useDesktopStore()

const desktopRef = ref()
const appsRef = ref()
const bodyRef = ref()
const visible = ref(false)
const desktopHeight = ref('auto')
const index = ref(0)
const apps = ref()

const { isOutside } = useMouseInElement(bodyRef)

watch(
  () => isOutside.value,
  () => {
    if (desktopStore.isDragging && isOutside.value) {
      visible.value = false
    }
  }
)

const open = (id?: string) => {
  visible.value = true
  // id存在，说明是从文件夹打开的
  index.value = desktopStore.apps.findIndex((item) => item.id === (id || desktopStore.relatedId))
  apps.value = desktopStore.apps[index.value]

  if (index.value !== -1) {
    if (!apps.value.child || apps.value.child?.value.length === 0) {
      apps.value.child = {
        name: '文件夹',
        value: []
      }
      apps.value.child?.value.push({
        id: uuidv4(),
        title: uuidv4(),
        img: apps.value.img,
        isFolder: false
      })
      apps.value.child?.value.push({
        id: uuidv4(),
        title: uuidv4(),
        img: apps.value.img,
        isFolder: false
      })
      apps.value.child?.value.push({
        id: uuidv4(),
        title: uuidv4(),
        img: apps.value.img,
        isFolder: false
      })
      apps.value.child?.value.push({
        id: uuidv4(),
        title: uuidv4(),
        img: apps.value.img,
        isFolder: false
      })
      apps.value.child?.value.push({
        id: uuidv4(),
        title: uuidv4(),
        img: apps.value.img,
        isFolder: false
      })
      apps.value.child?.value.push({
        id: uuidv4(),
        title: uuidv4(),
        img: apps.value.img,
        isFolder: false
      })
      apps.value.child?.value.push({
        id: uuidv4(),
        title: uuidv4(),
        img: apps.value.img,
        isFolder: false
      })
      apps.value.child?.value.push({
        id: uuidv4(),
        title: uuidv4(),
        img: apps.value.img,
        isFolder: false
      })
      apps.value.child?.value.push({
        id: uuidv4(),
        title: uuidv4(),
        img: apps.value.img,
        isFolder: false
      })
      apps.value.child?.value.push({
        id: uuidv4(),
        title: uuidv4(),
        img: apps.value.img,
        isFolder: false
      })
      apps.value.child?.value.push({
        id: uuidv4(),
        title: uuidv4(),
        img: apps.value.img,
        isFolder: false
      })
    }

    nextTick(() => {
      const element = appsRef.value

      useDesktopSortable({
        element,
        list: apps.value.child?.value,
        options: {
          group: 'desktop'
        },
        withFolder: false
      })
    })
  }
}

const gridStyles = ref({
  display: 'grid',
  'grid-template-columns': `repeat(auto-fill, ${appSize.value.containerWidth})`,
  'grid-template-rows': `repeat(auto-fill, ${appSize.value.containerHeight})`,
  'grid-gap': `${appCSSConstant.value.gridGapY} ${appCSSConstant.value.gridGapX}`
})

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
  >
    <template #header>
      <div :class="ns.b('header')">
        <input :value="apps.child?.name" :class="ns.be('header', 'title')" />
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
