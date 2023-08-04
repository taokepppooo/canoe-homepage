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
const currentDesktop = reactive(desktopStore.currentDesktop)
const desktopList = reactive(desktopAppStore.desktopList)

onMounted(() => {
  // TODO: 替换数据
  const apps = []
  for (let i = 0; i < 100; i++) {
    apps.push({
      id: uuidv4(),
      title: `${i}`,
      img: 'https://files.codelife.cc/icons/guide.svg',
      isFolder: false
    })
  }
  desktopAppStore.desktopList.push({
    id: uuidv4(),
    name: '桌面1',
    child: apps.slice(0, 25)
  })
  desktopAppStore.desktopList.push({
    id: uuidv4(),
    name: '桌面2',
    child: apps.slice(26, 36)
  })
  desktopAppStore.desktopList.push({
    id: uuidv4(),
    name: '桌面3',
    child: apps.slice(37, 70)
  })
  desktopStore.currentDesktop.id = desktopList[0].id
  desktopStore.currentDesktop.index = 0

  nextTick(() => {
    initDragged()
  })
  // useDesktop(desktopHeight, desktopRef, desktopAppStore.apps)
})

const { desktopChangeDirection } = useDesktopController(carouselRef)

const changeDirectionMap = {
  prev: () => {
    carouselRef.value.prev()
  },
  next: () => {
    carouselRef.value.next()
  }
}

const setDesktopId = (idx: number) => {
  desktopStore.currentDesktop.id = currentDesktop.id
  desktopStore.currentDesktop.index = idx
}

watch(
  () => desktopChangeDirection.value,
  (value) => {
    if (value) {
      changeDirectionMap[value]()
    }
  }
)

const handleChanged = (idx: number) => {
  setDesktopId(idx)
  desktopStore.currentDesktop.id = desktopList.find((item, index) => index === idx)?.id
  desktopStore.currentDesktop.index = idx

  initDragged()
}

const initDragged = () => {
  const currentDesktopId = currentDesktop.id as string
  const currentDesktopIndex = currentDesktop.index as number
  const element = appsRef.value[currentDesktopId] as HTMLElement

  if (currentDesktopIndex >= 0) {
    useDesktopSortable({
      element,
      list: desktopList[currentDesktopIndex].child,
      options: {
        group: 'desktop'
      }
    })
  }
}
</script>

<template>
  <div ref="desktopRef" :class="ns.b()">
    <ElCarousel
      ref="carouselRef"
      indicator-position="outside"
      :autoplay="false"
      arrow="never"
      trigger="click"
      @change="handleChanged"
    >
      <ElCarouselItem v-for="desktop in desktopAppStore.desktopList" :key="desktop.id">
        <div :ref="(ref: ElementRef) => (appsRef[desktop!.id] = ref)" :class="ns.e('apps')">
          <template v-for="app in desktop.child" :key="app.id">
            <DesktopApp :app="app" :gap-rows="1" :gap-columns="1" />
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
