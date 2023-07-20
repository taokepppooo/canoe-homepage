import type { DragStatus } from '@/types/desktop'

export const useDesktopStore = defineStore('desktop', {
  state: (): State => ({
    draggedId: '',
    relatedId: '',
    isDragging: false,
    openFolderIndex: null, // 当前打开的文件的索引
    dragStatus: '0' // 0: 初始化 1: 拖拽 2: 合并文件夹
  })
})

interface State {
  draggedId: string | null
  relatedId: string | null
  isDragging: boolean
  openFolderIndex: number | null
  dragStatus: DragStatus
}
