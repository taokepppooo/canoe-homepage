<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { useNamespace } from '@/hooks/useNamespace'
import { useDesktopGlobal } from '@/hooks/useGlobal'
import { useDesktop, useDesktopSortable } from '@/hooks/desktop/useDesktop'
import { useDesktopAppStore } from '@/stores/desktopApp'

const ns = useNamespace('desktop')
const { appCSSConstant, appSize } = useDesktopGlobal()

const appsRef = ref()
const desktopHeight = ref('auto')
const desktopAppStore = useDesktopAppStore()
const desktopRef = ref()

// TODO: 替换数据
for (let i = 0; i < 100; i++) {
  desktopAppStore.apps.push({
    id: uuidv4(),
    title: `${i}`,
    img: 'https://files.codelife.cc/icons/guide.svg',
    isFolder: false,
    isShow: true
  })
}

nextTick(() => {
  const element = appsRef.value

  useDesktopSortable({
    element,
    list: desktopAppStore.apps,
    options: {
      group: 'desktop'
    }
  })

  useDesktop(desktopHeight, desktopRef, desktopAppStore.apps)
})
</script>

<template>
  <div ref="desktopRef" :class="ns.b()">
    <div ref="appsRef" :class="ns.e('apps')">
      <template v-for="app in desktopAppStore.apps" :key="app.id">
        <DesktopApp v-show="app.isShow" :app="app" :gap-rows="1" :gap-columns="1" />
      </template>
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
