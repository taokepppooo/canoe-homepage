import { useDesktopStore } from '@/stores/desktop'
import type { Direction } from '@/types/desktop'

export const useDesktopController = (
  refer: Ref
): {
  direction: Ref<Direction>
} => {
  const { elementX, elementY, elementWidth, elementHeight, isOutside } = useMouseInElement(refer)
  const desktopStore = useDesktopStore()

  // 由于拖拽时，鼠标会跑出元素，当在拖回元素时，会导致isOutside不刷新, 所以加上BUFFER解决isOutside不刷新带来的问题
  const BUFFER = 10
  const direction = computed(() => {
    if (desktopStore.isDragging && isOutside.value) {
      if (
        elementX.value < -BUFFER &&
        elementY.value > BUFFER &&
        elementY.value < elementHeight.value
      ) {
        return 'left'
      }
      if (
        elementX.value > elementWidth.value &&
        elementY.value > BUFFER &&
        elementY.value < elementHeight.value
      ) {
        return 'right'
      }
    }

    return ''
  })

  return {
    direction
  }
}
