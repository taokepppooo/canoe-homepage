import { useDesktopStore } from '@/stores/desktop'
import { useDesktopSortableReactive } from './useDesktopSortableReactive'
import type { SortableEventOption } from '@/types/sortable'
import type { App, SortableConstant } from '@/types/desktop'

const desktopStore = useDesktopStore()
const { draggedIndex } = useDesktopSortableReactive()

export const useDesktopSortableStart = () => {
  const start = (evt: SortableEventOption, list: App[], constant: SortableConstant) => {
    const {
      originalEvent: { offsetX, offsetY },
      oldIndex
    } = evt

    const { dragged } = desktopStore

    dragged.desktopIndex = desktopStore.currentDesktop.index
    dragged.index = oldIndex
    desktopStore.isDragging = true
    constant.draggedOffsetX = offsetX
    constant.draggedOffsetY = offsetY
    const draggedId = list[draggedIndex.value].id
    const parentId = list[draggedIndex.value].parentId

    if (draggedId !== dragged.id) {
      dragged.id = draggedId

      if (parentId) {
        dragged.parentId = parentId
        dragged.inFolder = true
      }
    }

    dragged.inFolder = Boolean(list[draggedIndex.value].parentId)
  }

  return {
    start
  }
}
