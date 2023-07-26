import type { DragStatus } from '@/types/desktop'

export const useDesktopStore = defineStore('desktop', {
  state: (): State => ({
    draggedId: '',
    relatedId: '',
    isDragging: false,
    openFolderIndex: null,
    dragStatus: '0',
    currentDesktopId: ''
  })
})

interface State {
  draggedId: string | null
  relatedId: string | null
  isDragging: boolean
  openFolderIndex: number | null // 当前打开的文件的索引
  dragStatus: DragStatus
  currentDesktopId: string // 当前桌面id
}
