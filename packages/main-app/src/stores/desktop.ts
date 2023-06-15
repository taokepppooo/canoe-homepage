import type { App } from '@/types/desktop'

export const useDesktopStore = defineStore('desktop', {
  state: (): State => ({
    apps: [],
    draggedId: ''
  })
})

interface State {
  apps: Array<App>
  draggedId: string | null
}
