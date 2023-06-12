import type { App } from '@/types/desktop'

export const useDesktopStore = defineStore('desktop', {
  state: (): State => ({
    apps: []
  })
})

interface State {
  apps: Array<App>
}
