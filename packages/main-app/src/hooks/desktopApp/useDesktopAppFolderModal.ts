import { debounce } from 'lodash-es'
import { useDesktopStore } from '@/stores/desktop'

const desktopStore = useDesktopStore()

let oldElementX = 0
let oldElementY = 0
const isTimerOutside = ref(false)

export const useDesktopAppFolderModalTimerOutside = (
  refer: Ref
): {
  isTimerOutside: Ref<boolean>
} => {
  const { elementX, elementY, isOutside } = useMouseInElement(refer)

  watch(
    () => [elementX.value, elementY.value],
    () => {
      oldElementX = elementX.value
      oldElementY = elementY.value

      if (isOutside.value && desktopStore.isDragging) {
        debounceOutside(elementX, elementY)
      }
    }
  )

  return {
    isTimerOutside
  }
}

const DELAY = 500
const debounceOutside = debounce((elementX: Ref<number>, elementY: Ref<number>) => {
  if (oldElementX === elementX.value && oldElementY === elementY.value) {
    isTimerOutside.value = true
  } else {
    isTimerOutside.value = false
  }
}, DELAY)
