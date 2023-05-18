<script setup lang="ts">
import { useNamespace } from '@/hooks/useNamespace'
import { useDesktop } from '@/hooks/desktop/useDesktop'

const ns = useNamespace('desktop-app-icon')
const { appCSSConstant, appSize } = useDesktop()

const attrs = useAttrs()
console.log(attrs['gap-rows'])
console.log(attrs['gap-columns'])
// const width =

// const appSize4x2 = ref<AppSize>({
//   width: `${
//     parseInt(appSize1x1.value.width) * 4 - (4 - 1) * parseInt(appCSSConstant.value.gridGapX)
//   }px`,
//   height: `${
//     parseInt(appSize1x1.value.height) * 2 - (2 - 1) * parseInt(appCSSConstant.value.gridGapY)
//   }px`
// })
</script>

<template>
  <div :class="ns.b()">
    <img :class="ns.b('img')" src="https://files.codelife.cc/icons/guide.svg" />
  </div>
</template>

<style lang="less">
@ns: ~'@{namespace}-desktop-app-icon';

.@{ns} {
  margin: 0 auto;
  width: v-bind('appSize.width');
  height: v-bind('appSize.height');
  overflow: hidden;
  border-radius: v-bind('appCSSConstant.borderRadius');
  box-shadow: 0 0 10px #00000026;

  &-img {
    background-color: #febc04;
    background-size: cover;
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
  }
}
</style>
