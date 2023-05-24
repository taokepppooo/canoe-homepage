<script setup lang="ts">
import { useNamespace } from '@/hooks/useNamespace'
import { useSortable } from '@/hooks/useSortable'
import { useDesktop } from '@/hooks/desktop/useDesktop'

const ns = useNamespace('desktop')
const { appCSSConstant, appSize } = useDesktop()

const appsRef = ref()

nextTick(() => {
  const element = appsRef.value
  useSortable(element, {
    sort: true,
    forceFallback: true
  })
})

const apps = ref([
  {
    gapRows: 2,
    gapColumns: 4
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
    gapRows: 2,
    gapColumns: 4
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
    gapRows: 2,
    gapColumns: 2
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
    <div ref="appsRef" :class="ns.e('apps')">
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
    grid-template-columns: repeat(auto-fill, v-bind('appSize.width'));
    grid-template-rows: repeat(auto-fill, v-bind('appSize.height'));
    grid-gap: v-bind('appCSSConstant.gridGapY') v-bind('appCSSConstant.gridGapX');
    justify-content: center;
    user-select: none;
  }
}
</style>
