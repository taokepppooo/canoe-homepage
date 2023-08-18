import { useDesktopStore } from '@/stores/desktop'
import { useDesktopSortableReactive } from './useDesktopSortableReactive'
import type { SortableEventOption } from '@/types/sortable'
import type { App } from '@/types/desktop'

const desktopStore = useDesktopStore()
const { draggedIndex, draggedOffsetX, draggedOffsetY } = useDesktopSortableReactive()

export const useDesktopSortableStart = () => {
  const start = (evt: SortableEventOption, list: App[]) => {
    const {
      originalEvent: { offsetX, offsetY }
    } = evt

    desktopStore.dragged.desktopIndex = desktopStore.currentDesktop.index
    desktopStore.isDragging = true
    draggedOffsetX.value = offsetX
    draggedOffsetY.value = offsetY
    desktopStore.dragged.index = evt.oldIndex

    const draggedId = list[draggedIndex.value].id || ''
    if (draggedId !== desktopStore.dragged.id) {
      desktopStore.dragged.id = draggedId
    }
    if (list[draggedIndex.value].parentId) {
      desktopStore.dragged.inFolder = true
    } else {
      desktopStore.dragged.inFolder = false
    }
  }

  return {
    start
  }
}
