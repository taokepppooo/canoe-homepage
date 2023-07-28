<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { useNamespace } from '@/hooks/useNamespace'
import { useDesktopGlobal } from '@/hooks/useGlobal'
import { useDesktopSortable } from '@/hooks/desktop/useDesktopSortable'
import { useDesktopAppStore } from '@/stores/desktopApp'
import { useDesktopStore } from '@/stores/desktop'
import { useDesktopController } from '@/hooks/desktop/useDesktopController'
import type { ElementRef } from '@/types/vue'

const ns = useNamespace('desktop-controller')
const { appCSSConstant, appSize } = useDesktopGlobal()

const desktopRef = ref()
const carouselRef = ref()
const appsRef = ref<{ [key: string]: ElementRef }>({})
const desktopHeight = ref('auto')
const desktopAppStore = useDesktopAppStore()
const desktopStore = useDesktopStore()

onMounted(() => {
  // TODO: 替换数据
  const apps = []
  for (let i = 0; i < 100; i++) {
    apps.push({
      id: uuidv4(),
      title: `${i}`,
      img: 'https://files.codelife.cc/icons/guide.svg',
      isFolder: false,
      isShow: true
    })
  }
  desktopAppStore.desktopList.push({
    id: uuidv4(),
    name: '桌面1',
    child: apps.slice(0, 20)
  })
  desktopAppStore.desktopList.push({
    id: uuidv4(),
    name: '桌面2',
    child: apps.slice(10, 25)
  })
  desktopAppStore.desktopList.push({
    id: uuidv4(),
    name: '桌面3',
    child: apps.slice(25, 50)
  })
  desktopStore.currentDesktopId = desktopAppStore.desktopList[0].id

  nextTick(() => {
    initDragged()
  })
  // useDesktop(desktopHeight, desktopRef, desktopAppStore.apps)
})

const direction = useDesktopController(carouselRef).direction

const initDragged = () => {
  const element = appsRef.value[desktopStore.currentDesktopId] as HTMLElement
  const index = desktopAppStore.desktopList.findIndex(
    (desktop) => desktop.id === desktopStore.currentDesktopId
  )

  if (index >= 0) {
    useDesktopSortable({
      element,
      list: desktopAppStore.desktopList[index].child,
      options: {
        group: 'desktop'
      }
    })
  }
}
</script>

<template>
  <div ref="desktopRef" :class="ns.b()">
    {{ direction }}1111
    <ElCarousel ref="carouselRef" indicator-position="outside" :autoplay="false" arrow="never">
      <ElCarouselItem v-for="desktop in desktopAppStore.desktopList" :key="desktop.id">
        <div :ref="(ref: ElementRef) => (appsRef[desktop!.id] = ref)" :class="ns.e('apps')">
          <template v-for="app in desktop.child" :key="app.id">
            <DesktopApp v-show="app.isShow" :app="app" :gap-rows="1" :gap-columns="1" />
          </template>
        </div>
      </ElCarouselItem>
    </ElCarousel>
  </div>
</template>

<style lang="less">
@ns: ~'@{namespace}-desktop-controller';

.@{ns} {
  width: 70vw;
  height: v-bind('desktopHeight');
  margin: 0 auto;

  &__apps {
    display: grid;
    grid-template-columns: repeat(auto-fill, v-bind('appSize.width'));
    grid-template-rows: repeat(auto-fill, v-bind('appSize.height'));
    grid-gap: v-bind('appCSSConstant.gridGapY') v-bind('appCSSConstant.gridGapX');
    justify-content: center;
    user-select: none;
  }
}
</style>
