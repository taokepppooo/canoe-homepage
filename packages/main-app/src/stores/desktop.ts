import type { DragStatus } from '@/types/desktop'

export const useDesktopStore = defineStore('desktop', {
  state: (): State => ({
    draggedId: '',
    relatedId: '',
    isDragging: false,
    openFolderIndex: null,
    dragStatus: '0',
    oldCurrentDesktopId: '',
    currentDesktopId: '',
    desktopSortableList: []
  })
})

interface State {
  draggedId: string | null
  relatedId: string | null
  isDragging: boolean
  openFolderIndex: number | null // 当前打开的文件的索引
  dragStatus: DragStatus
  oldCurrentDesktopId: string // 上一个桌面id
  currentDesktopId: string // 当前桌面id
  desktopSortableList: string[] // 桌面排序列表
}
