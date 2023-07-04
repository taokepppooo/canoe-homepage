export const useDesktopStore = defineStore('desktop', {
  state: (): State => ({
    draggedId: '',
    relatedId: '',
    isDragging: false
  })
})

interface State {
  draggedId: string | null
  relatedId: string | null
  isDragging: boolean
}
