<script setup lang="ts">
import { useNamespace } from '@/hooks/useNamespace'
import { useSortable } from '@/hooks/useSortable'
import { useDesktopGlobal } from '@/hooks/useGlobal'
import { useDesktop } from '@/hooks/desktop/useDesktop'
import type { MoveEvent } from 'sortablejs'

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

  useSortable(element, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMove: (evt: any) => {
      console.log(evt)
      console.log(evt.originalEvent)
      const related = evt.related
      const dragged = evt.dragged
      const offsetX = related.offsetLeft - dragged.offsetLeft
      const offsetY = related.offsetTop - dragged.offsetTop

      let targetInnerXPosition = 0
      let targetInnerYPosition = 0
      // 横向和纵向都变动
      if (offsetX && offsetY) {
        targetInnerXPosition =
          offsetX % (parseInt(appCSSConstant.value.gridGapX) + parseInt(appSize.value.width))
        targetInnerYPosition =
          offsetY % (parseInt(appCSSConstant.value.gridGapY) + parseInt(appSize.value.height))
      } else {
        // 只有横向变动
        if (offsetX) {
          targetInnerXPosition =
            offsetX % (parseInt(appCSSConstant.value.gridGapX) + parseInt(appSize.value.width))
          console.log(targetInnerXPosition, 'x')
        }

        // 只有纵向变动
        if (offsetY) {
          targetInnerYPosition =
            offsetY % (parseInt(appCSSConstant.value.gridGapY) + parseInt(appSize.value.height))
          console.log(offsetY, '1')
          console.log(parseInt(appCSSConstant.value.gridGapY) + parseInt(appSize.value.height), '2')
          console.log(targetInnerYPosition, 'y')
        }
      }
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
    <div style="height: 20px"></div>
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
