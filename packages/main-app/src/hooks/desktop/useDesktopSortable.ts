import { useSortable } from '@/hooks/useSortable'
import { useDesktopSortableStart } from './useDesktopSortableStart'
import { useDesktopSortableMove } from './useDesktopSortableMove'
import { useDesktopSortableEnd } from './useDesktopSortableEnd'
import type Sortable from 'sortablejs'
import type { SortableEventOption } from '@/types/sortable'
import type { DesktopSortOptions, MoveOriginalEvent, SortableConstant } from '@/types/desktop'

const desktopSortableStart = useDesktopSortableStart()
const desktopSortableMove = useDesktopSortableMove()
const desktopSortableEnd = useDesktopSortableEnd()

const constant: SortableConstant = {
  draggedOffsetX: 0,
  draggedOffsetY: 0,
  moveX: 0,
  moveY: 0,
  isDeleteDraggedApp: false,
  timer: null,
  newItem: null,
  relatedList: []
}

// 只适用于首页桌面和首页桌面文件夹内的拖拽
export const useDesktopSortable = ({ element, list, options }: DesktopSortOptions) => {
  useSortable(element, {
    ...options,
    forceFallback: false,
    sort: true,
    onStart: (evt: SortableEventOption) => desktopSortableStart.start(evt, list, constant),
    onMove: (evt: SortableEventOption, originalEvent: MoveOriginalEvent) =>
      desktopSortableMove.move(evt, originalEvent, list, constant),
    onEnd: (evt: Sortable.SortableEvent) => desktopSortableEnd.end(evt, list, constant)
  })
}
