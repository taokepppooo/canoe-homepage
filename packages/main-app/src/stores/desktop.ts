import type { State } from '@/types/desktop'

export const useDesktopStore = defineStore('desktop', {
  state: (): State => ({
    related: {},
    dragged: {},
    openFolder: {},
    currentDesktop: {},
    isDragging: false,
    dragStatus: '0',
    desktopSortableList: []
  })
})
