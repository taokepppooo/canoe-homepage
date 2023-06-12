<script setup lang="ts">
import { useNamespace } from '@/hooks/useNamespace'
const ns = useNamespace('desktop-folder-modal')

const visible = ref(false)

const open = () => {
  console.log('open')
  visible.value = true
}

defineExpose({
  open
})
</script>

<template>
  <ElDialog v-model="visible" :class="ns.b()" :show-close="false" append-to-body>
    <template #header="{ titleId, titleClass }">
      <div class="my-header">
        <h4 :id="titleId" :class="titleClass">This is a custom header!</h4>
      </div>
    </template>
    This is dialog content.
  </ElDialog>
</template>

<style lang="less">
@ns: ~'@{namespace}-desktop-folder-modal';

.@{ns} {
}
</style>
