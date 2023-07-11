import { debounce } from 'lodash-es'
import type { App } from '@/types/desktop'

export const useDesktopAppStore = defineStore('desktopApp', {
  state: (): State => ({
    apps: []
  })
})

interface State {
  apps: App[]
}

useDesktopAppStore().$subscribe((mutation, state) => {
  console.log(mutation)
  console.log(state)
  if (mutation.storeId === 'desktopApp') {
    debounce(() => {
      console.log('aaa')
    }, 2000)
  }
})
