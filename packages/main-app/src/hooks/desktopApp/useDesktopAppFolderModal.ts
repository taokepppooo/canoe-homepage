import { debounce } from 'lodash-es'
import { useDesktopStore } from '@/stores/desktop'
import { useDesktopAppFolderModalStore } from '@/stores/desktopAppFolderModal'

const desktopStore = useDesktopStore()
const desktopAppFolderModalStore = useDesktopAppFolderModalStore()

let oldX = 0
let oldY = 0
const isTimerOutside = ref(false)

const DELAY = 500
const debounceOutside = debounce((x: Ref<number>, y: Ref<number>) => {
  const isDebounceOutside =
    oldX === x.value && oldY === y.value && !desktopAppFolderModalStore.isFirstMergeOpen
  isTimerOutside.value = isDebounceOutside
}, DELAY)

export const useDesktopAppFolderModalTimerOutside = (
  refer: Ref
): {
  isTimerOutside: Ref<boolean>
} => {
  const { x, y, isOutside } = useMouseInElement(refer)

  watch(
    () => [x.value, y.value],
    () => {
      oldX = x.value
      oldY = y.value

      if (isOutside.value && desktopStore.isDragging) {
        const isDebounceOutside =
          oldX === x.value && oldY === y.value && !desktopAppFolderModalStore.isFirstMergeOpen

        if (!isDebounceOutside && desktopAppFolderModalStore.isFirstMergeOpen) {
          desktopAppFolderModalStore.isFirstMergeOpen = false
        }
        debounceOutside(x, y)
      } else {
        debounceOutside.cancel()
      }
    }
  )

  return {
    isTimerOutside
  }
}
