<script setup lang="ts">
import { useNamespace } from '@/hooks/useNamespace'
import { useSortable } from '@/hooks/useSortable'
import { useDesktopGlobal } from '@/hooks/useGlobal'
import { useDesktop } from '@/hooks/desktop/useDesktop'

const ns = useNamespace('desktop')
const { appCSSConstant, appSize } = useDesktopGlobal()

const appsRef = ref()
const desktopHeight = ref('auto')

// TODO: 替换数据
const apps = ref<[{ [key: string]: object }]>([{}])
const desktopRef = ref()

for (let i = 0; i < 100; i++) {
  apps.value.push({})
}

nextTick(() => {
  const element = appsRef.value

  const ENABLE_DRAG_DISTANCE = 5
  useSortable(element, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMove: (evt: any) => {
      console.log(evt)
      const originalEvent = evt.originalEvent
      const clientX = originalEvent.clientX
      const clientY = originalEvent.clientY
      const related = evt.related
      const relatedRect = evt.relatedRect
      const draggedRect = evt.draggedRect
      // 向右
      if (clientX > draggedRect.right && clientX < relatedRect.right - ENABLE_DRAG_DISTANCE) {
        console.log('x-right-inner')
        return false
      }
      console.log(clientX)
      console.log(related.offsetLeft)
      // 向左
      if (
        clientX < draggedRect.left + parseInt(appSize.value.width) &&
        clientX > relatedRect.left + ENABLE_DRAG_DISTANCE
      ) {
        console.log('x-left-inner')
        return false
      }

      console.log('outer')
    }
  })

  useDesktop(
    desktopHeight,
    desktopRef,
    appCSSConstant.value.gridGapX,
    appSize.value.width,
    appCSSConstant.value.gridGapY,
    appSize.value.height,
    apps
  )
})
</script>

<template>
  <div ref="desktopRef" :class="ns.b()">
    <div ref="appsRef" :class="ns.e('apps')">
      <DesktopApp v-for="(app, index) in apps" :key="index" :gap-rows="1" :gap-columns="1" />
    </div>
  </div>
</template>

<style lang="less">
@ns: ~'@{namespace}-desktop';

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
