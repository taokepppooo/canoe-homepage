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
  grid-row: span v-bind(gapRows);
  grid-column: span v-bind(gapColumns);
  position: relative;

  &__title {
    .text-ellipsis();

    mask: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxmb3JlaWduT2JqZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxib2R5IGNsYXNzPSJ3cmFwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCI+PHN0eWxlPi53cmFwe2JveC1zaXppbmc6Ym9yZGVyLWJveDttYXJnaW46MDtoZWlnaHQ6MTAwJTtwYWRkaW5nOjEwcHh9LnNoYWRvd3toZWlnaHQ6MTAwJTtiYWNrZ3JvdW5kOiMwMDA7Ym9yZGVyLXJhZGl1czoxMHB4O2JveC1zaGFkb3c6MCAwIDVweCAjMDAwLDAgMCAxMHB4ICMwMDAsMCAwIDE1cHggIzAwMH08L3N0eWxlPjxkaXYgY2xhc3M9InNoYWRvdyIvPjwvYm9keT48L2ZvcmVpZ25PYmplY3Q+PC9zdmc+');
    backdrop-filter: blur(10px);
    position: absolute;
    left: -10px;
    width: calc(v-bind('size.width') + 20px);
    color: #fff;
    font-size: 12px;
    margin: 8px 0;
    text-align: center;
  }
}
</style>
