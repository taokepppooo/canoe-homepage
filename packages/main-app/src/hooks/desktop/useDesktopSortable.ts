import { useSortable } from '@/hooks/useSortable'
import { useDesktopSortableStart } from './useDesktopSortableStart'
import { useDesktopSortableMove } from './useDesktopSortableMove'
import { useDesktopSortableEnd } from './useDesktopSortableEnd'
import type Sortable from 'sortablejs'
import type { SortableEventOption } from '@/types/sortable'
import type { DesktopSortOptions, MoveOriginalEvent } from '@/types/desktop'

const desktopSortableStart = useDesktopSortableStart()
const desktopSortableMove = useDesktopSortableMove()
const desktopSortableEnd = useDesktopSortableEnd()

// 只适用于首页桌面和首页桌面文件夹内的拖拽
export const useDesktopSortable = ({ element, list, options }: DesktopSortOptions) => {
  useSortable(element, {
    ...options,
    forceFallback: false,
    sort: true,
    onStart: (evt: SortableEventOption) => desktopSortableStart.start(evt, list),
    onMove: (evt: SortableEventOption, originalEvent: MoveOriginalEvent) =>
      desktopSortableMove.move(evt, originalEvent, list),
    onEnd: (evt: Sortable.SortableEvent) => desktopSortableEnd.end(evt, list)
  })
}
