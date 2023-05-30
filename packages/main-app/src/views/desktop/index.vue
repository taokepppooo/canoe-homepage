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

  useSortable(element, {
    swap: true, // Enable swap plugin
    swapClass: 'highlight', // The class applied to the hovered swap item
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMove: (evt: any) => {
      console.log(evt)
      console.log(evt.originalEvent)
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

.highlight {
  transform: scale(1.1);
}

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
