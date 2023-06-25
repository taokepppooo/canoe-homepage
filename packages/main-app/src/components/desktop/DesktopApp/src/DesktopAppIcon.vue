<script setup lang="ts">
import { useNamespace } from '@/hooks/useNamespace'
import { useDesktopGlobal } from '@/hooks/useGlobal'
import type { App } from '@/types/desktop'

const props = defineProps<{
  width: string
  height: string
}>()

const ns = useNamespace('desktop-app-icon')
const { appCSSConstant } = useDesktopGlobal()

const { width, height } = toRefs(props)
const app: Ref<App> | undefined = inject('app')
</script>

<template>
  <div :class="ns.b()">
    <img :class="ns.b('img')" :src="app?.img" />
  </div>
</template>

<style lang="less">
@ns: ~'@{namespace}-desktop-app-icon';

.@{ns} {
  width: v-bind(width);
  height: v-bind(height);
  overflow: hidden;
  border-radius: v-bind('appCSSConstant.borderRadius');
  box-shadow: 0 0 10px #00000026;
  cursor: pointer;

  &-img {
    background-color: #febc04;
    background-size: cover;
    background-repeat: no-repeat;
    width: inherit;
    height: inherit;
  }
}
</style>
