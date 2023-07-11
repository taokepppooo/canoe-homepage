<script setup lang="ts">
import { useNamespace } from '@/hooks/useNamespace'
import { useDesktopApp } from '@/hooks/desktop/useDesktopApp'
import DesktopAppIcon from './src/DesktopAppIcon.vue'
import type { App } from '@/types/desktop'

const ns = useNamespace('desktop-app')

const props = defineProps<{
  gapRows: number
  gapColumns: number
  app: App
}>()

const { gapRows, gapColumns, app } = toRefs(props)

const {
  gapRows: desktopGapRows,
  gapColumns: desktopGColumns,
  size
} = useDesktopApp(gapRows, gapColumns)

provide('app', app)
</script>

<template>
  <div :class="ns.b()">
    <div :class="ns.b('wrapper')">
      <DesktopAppFolder
        v-if="app.isFolder"
        :width="size.width"
        :height="size.height"
      ></DesktopAppFolder>
      <DesktopAppIcon v-else :width="size.width" :height="size.height"></DesktopAppIcon>
      <p :class="ns.e('title')">{{ app.title }}</p>
    </div>
  </div>
</template>

<style lang="less">
@import url('~/global/common.less');
@ns: ~'@{namespace}-desktop-app';

.@{ns} {
  grid-row: span v-bind(desktopGapRows);
  grid-column: span v-bind(desktopGColumns);
  width: v-bind('size.width');
  height: v-bind('size.height');
  position: relative;

  &-wrapper {
    width: v-bind('size.width');
    height: v-bind('size.height');
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &__title {
    .text-ellipsis();

    position: absolute;
    left: -10px;
    width: calc(v-bind('size.width') + 20px);
    filter: drop-shadow(1px 0 1px rgba(0 0 0 / 70%));
    color: #fff;
    font-size: 13px;
    margin: 8px 0;
    text-align: center;
  }
}
</style>
