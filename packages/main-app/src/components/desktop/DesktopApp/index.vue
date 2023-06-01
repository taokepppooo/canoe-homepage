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
    <div :class="ns.b('wrapper')">
      <DesktopAppIcon :width="size.width" :height="size.height" v-bind="attrs"></DesktopAppIcon>
      <p :class="ns.e('title')">iTab新手引导22222222222</p>
    </div>
  </div>
</template>

<style lang="less">
@import url('~/global/common.less');
@ns: ~'@{namespace}-desktop-app';

.@{ns} {
  grid-row: span v-bind(gapRows);
  grid-column: span v-bind(gapColumns);
  width: v-bind('size.containerWidth');
  height: v-bind('size.containerHeight');
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
