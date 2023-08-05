import type { DragStatus } from '@/types/desktop'

export const useDesktopStore = defineStore('desktop', {
  state: (): State => ({
    related: {},
    dragged: {},
    openFolder: {},
    currentDesktop: {},
    oldDesktop: {},
    isDragging: false,
    dragStatus: '0',
    oldCurrentDesktopId: '',
    desktopSortableList: []
  })
})

interface SortableInfo {
  id?: string
  index?: number
  deskTopIndex?: number
  inFolder?: boolean
}

interface OpenFolder {
  id?: string
  index?: number
  deskTopIndex?: number
}

interface DesktopDragInfo {
  id?: string
  index?: number // 在list中所在的索引
}

interface State {
  dragged: SortableInfo
  related: SortableInfo
  openFolder: OpenFolder
  currentDesktop: DesktopDragInfo
  oldDesktop: DesktopDragInfo
  isDragging: boolean
  dragStatus: DragStatus
  oldCurrentDesktopId: string // 上一个桌面id
  desktopSortableList: string[] // 桌面排序列表
}
