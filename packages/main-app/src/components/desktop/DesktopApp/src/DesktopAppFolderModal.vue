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

const visible = ref(false)
const desktopHeight = ref('auto')
const appsRef = ref()
const index = ref(0)
const apps = ref()

const open = (id?: string) => {
  visible.value = true
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

      useDesktopSortable(element, apps.value.child?.value || [], true)
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
    <div :class="ns.b('body')">
      <div ref="desktopRef" :class="ns.be('body', 'desktop')" :style="{ height: desktopHeight }">
        <div ref="appsRef" :class="ns.be('body__desktop', 'apps')" :style="gridStyles">
          <DesktopApp
            v-for="app in apps.child?.value"
            :id="app.id"
            :key="app.id"
            :title="app.title"
            :img="app.img"
            :is-folder="app.isFolder"
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
      }
    }
  }

  &-body {
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
