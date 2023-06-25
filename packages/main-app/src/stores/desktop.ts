import type { App } from '@/types/desktop'

export const useDesktopStore = defineStore('desktop', {
  state: (): State => ({
    apps: [],
    draggedId: '',
    relatedId: '',
    isDragging: false
  })
})

interface State {
  apps: Array<App>
  draggedId: string | null
  relatedId: string | null
  isDragging: boolean
}
