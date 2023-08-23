import { debounce } from 'lodash-es'
import { useDesktopStore } from '@/stores/desktop'
import { useDesktopAppFolderModalStore } from '@/stores/desktopAppFolderModal'

const desktopStore = useDesktopStore()
const desktopAppFolderModalStore = useDesktopAppFolderModalStore()

let oldX = 0
let oldY = 0

const DELAY = 500
const debounceOutside = debounce((x: Ref<number>, y: Ref<number>, isTimerOutside: Ref<boolean>) => {
  isTimerOutside.value = isDebounceOutside(x, y)
}, DELAY)

const isDebounceOutside = (x: Ref<number>, y: Ref<number>) => {
  return oldX === x.value && oldY === y.value && !desktopAppFolderModalStore.isFirstMergeOpen
}

export const useDesktopAppFolderModalTimerOutside = (refer: Ref, isTimerOutside: Ref<boolean>) => {
  const { x, y, isOutside } = useMouseInElement(refer)

  watch(
    () => [x.value, y.value],
    () => {
      oldX = x.value
      oldY = y.value

      if (isOutside.value && desktopStore.isDragging) {
        if (oldX !== x.value || oldY !== y.value || desktopAppFolderModalStore.isFirstMergeOpen) {
          desktopAppFolderModalStore.isFirstMergeOpen = false
        }

        debounceOutside(x, y, isTimerOutside)
      } else {
        debounceOutside.cancel()
      }
    }
  )
}
