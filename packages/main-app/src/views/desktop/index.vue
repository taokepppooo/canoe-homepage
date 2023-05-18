<script setup lang="ts">
import { useNamespace } from '@/hooks/useNamespace'
import { useDesktop } from '@/hooks/desktop/useDesktop'

const ns = useNamespace('desktop')
const { appCSSConstant, appSize } = useDesktop()

const apps = ref([
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  },
  {
    gapRows: 1,
    gapColumns: 1
  }
])
</script>

<template>
  <div :class="ns.b()">
    <div :class="ns.e('apps')">
      <DesktopApp
        v-for="(app, index) in apps"
        :key="index"
        :gap-rows="app.gapRows"
        :gap-columns="app.gapColumns"
      />
    </div>
  </div>
</template>

<style lang="less">
@ns: ~'@{namespace}-desktop';

.@{ns} {
  width: 70vw;
  margin: 0 auto;

  &__apps {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(v-bind('appSize.width'), 1fr));
    grid-template-rows: repeat(auto-fill, minmax(v-bind('appSize.height'), 1fr));
    grid-gap: v-bind('appCSSConstant.gridGapY') v-bind('appCSSConstant.gridGapX');
    justify-content: center;
    user-select: none;
  }
}
</style>
