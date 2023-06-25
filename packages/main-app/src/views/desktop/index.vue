<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { useNamespace } from '@/hooks/useNamespace'
import { useDesktopGlobal } from '@/hooks/useGlobal'
import { useDesktop, useDesktopSortable } from '@/hooks/desktop/useDesktop'
import { useDesktopStore } from '@/stores/desktop'

const ns = useNamespace('desktop')
const { appCSSConstant, appSize } = useDesktopGlobal()

const appsRef = ref()
const desktopHeight = ref('auto')
const desktopStore = useDesktopStore()
const desktopRef = ref()

// TODO: 替换数据
for (let i = 0; i < 100; i++) {
  desktopStore.apps.push({
    id: uuidv4(),
    title: `${i}`,
    img: 'https://files.codelife.cc/icons/guide.svg',
    isFolder: false
  })
}

nextTick(() => {
  const element = appsRef.value

  useDesktopSortable({ element, list: desktopStore.apps })

  useDesktop(desktopHeight, desktopRef, desktopStore.apps)
})
</script>

<template>
  <div ref="desktopRef" :class="ns.b()">
    <div ref="appsRef" :class="ns.e('apps')">
      <DesktopApp
        v-for="app in desktopStore.apps"
        :key="app.id"
        :app="app"
        :gap-rows="1"
        :gap-columns="1"
      />
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
    grid-template-columns: repeat(auto-fill, v-bind('appSize.containerWidth'));
    grid-template-rows: repeat(auto-fill, v-bind('appSize.containerHeight'));
    grid-gap: v-bind('appCSSConstant.gridGapY') v-bind('appCSSConstant.gridGapX');
    justify-content: center;
    user-select: none;
  }
}
</style>
