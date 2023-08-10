import { debounce } from 'lodash-es'
import { useDesktopStore } from '@/stores/desktop'
import type { Direction, DeskTopDirection } from '@/types/desktop'

let oldElementX = 0
let oldElementY = 0
const desktopChangeDirection = ref<DeskTopDirection>('')

const directionMap: Record<Direction, DeskTopDirection> = {
  left: 'prev',
  right: 'next',
  '': ''
}

export const useDesktopController = (
  refer: Ref
): {
  dragDirection: Ref<Direction>
  desktopChangeDirection: Ref<DeskTopDirection>
} => {
  const { elementX, elementY, elementWidth, elementHeight, isOutside } = useMouseInElement(refer)
  const desktopStore = useDesktopStore()

  // 由于拖拽时，鼠标会跑出元素，当在拖回元素时，会导致isOutside不刷新, 所以加上BUFFER解决isOutside不刷新带来的问题
  const BUFFER = 10
  const dragDirection = computed(() => {
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

  watch(
    () => [elementX.value, elementY.value],
    () => {
      if (dragDirection.value !== '') {
        changeDesktop(dragDirection, elementX, elementY)
      }
    }
  )

  return {
    dragDirection,
    desktopChangeDirection
  }
}

const DELAY = 500
let changeTimer: NodeJS.Timeout | null = null
const changeDesktop = (
  dragDirection: Ref<Direction>,
  elementX: Ref<number>,
  elementY: Ref<number>
) => {
  if (changeTimer) {
    clearTimeout(changeTimer)
    changeTimer = null
  }
  desktopChangeDirection.value = ''
  oldElementX = elementX.value
  oldElementY = elementY.value

  debounceUpdateOldElementPosition(dragDirection, elementX, elementY)
}

const debounceUpdateOldElementPosition = debounce(
  (dragDirection: Ref<Direction>, elementX: Ref<number>, elementY: Ref<number>) => {
    if (
      oldElementX &&
      oldElementY &&
      oldElementX === elementX.value &&
      oldElementY === elementY.value
    ) {
      desktopChangeDirection.value = directionMap[dragDirection.value] || ''
      changeTimer = setTimeout(() => {
        changeDesktop(dragDirection, elementX, elementY)
      }, DELAY)
    } else {
      return
    }
  },
  DELAY
)
