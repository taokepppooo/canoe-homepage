import { useDesktopStore } from '@/stores/desktop'
import type { Direction } from '@/types/desktop'

export const useDesktopController = (
  refer: Ref
): {
  direction: Ref<Direction>
} => {
  const { elementX, elementY, elementWidth, elementHeight, isOutside } = useMouseInElement(refer)
  const desktopStore = useDesktopStore()

  const direction = computed(() => {
    if (desktopStore.isDragging && isOutside.value) {
      if (elementX.value < 0 && elementY.value > 0 && elementY.value < elementHeight.value) {
        return 'left'
      }
      if (
        elementX.value > elementWidth.value &&
        elementY.value > 0 &&
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
