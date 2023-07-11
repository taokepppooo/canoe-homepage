import type { DragStatus } from '@/types/desktop'

export const useDesktopStore = defineStore('desktop', {
  state: (): State => ({
    draggedId: '',
    relatedId: '',
    isDragging: false,
    dragStatus: '0' // 0: 初始化 1: 拖拽 2: 合并文件夹
  })
})

interface State {
  draggedId: string | null
  relatedId: string | null
  isDragging: boolean
  dragStatus: DragStatus
}
