<script setup lang="ts">
import { useNamespace } from '@/hooks/useNamespace'
import { useDesktopApp } from '@/hooks/desktop/useDesktopApp'
import DesktopAppIcon from './src/DesktopAppIcon.vue'

const ns = useNamespace('desktop-app')

const attrs = useAttrs()

const { gapRows, gapColumns, size } = useDesktopApp(attrs['gap-rows'], attrs['gap-columns'])
</script>

<template>
  <div :class="ns.b()">
    <DesktopAppIcon :width="size.width" :height="size.height" v-bind="attrs"></DesktopAppIcon>
    <p :class="ns.e('title')">iTab新手引导22222222222</p>
  </div>
</template>

<style lang="less">
@import url('~/global/common.less');
@ns: ~'@{namespace}-desktop-app';

.@{ns} {
  width: v-bind('size.width');
  height: v-bind('size.height');
  grid-row: span v-bind(gapRows);
  grid-column: span v-bind(gapColumns);
  position: relative;

  &__title {
    .text-ellipsis();

    width: calc(v-bind('size.width') + 20px);
    position: absolute;
    left: -10px;
    color: #fff;
    font-size: 12px;
    margin: 8px 0;
    text-align: center;
  }
}
</style>
