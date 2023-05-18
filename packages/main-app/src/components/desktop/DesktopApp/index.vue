<script setup lang="ts">
import { useNamespace } from '@/hooks/useNamespace'
import { useDesktop } from '@/hooks/desktop/useDesktop'
import DesktopAppIcon from './src/DesktopAppIcon.vue'

const ns = useNamespace('desktop-app')
const { appCSSConstant } = useDesktop()

const attrs = useAttrs()
</script>

<template>
  <div :class="ns.b()">
    <DesktopAppIcon v-bind="attrs"></DesktopAppIcon>
    <p :class="ns.e('title')">iTab新手引导22222222222</p>
  </div>
</template>

<style lang="less">
@import url('~/global/common.less');
@ns: ~'@{namespace}-desktop-app';

.@{ns} {
  width: calc(100% + v-bind('appCSSConstant.gridGapX') / 2);

  &__title {
    .text-ellipsis();

    color: #fff;
    font-size: 12px;
    margin: 8px 0;
  }
}
</style>
