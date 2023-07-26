import { debounce } from 'lodash-es'
import { createLocalStorage } from '@/utils/cache'
import { Cache } from '@/types/enum'
import type { Desktop } from '@/types/desktop'

export const useDesktopAppStore = defineStore('desktopApp', {
  state: (): State => ({
    desktopList: []
  })
})

interface State {
  desktopList: Desktop[]
}

const localCache = createLocalStorage()

useDesktopAppStore().$subscribe((_mutation, state) => {
  console.log(state.desktopList, 'state.desktopList')
  if (state.desktopList.length) {
    debouncedStorage(state)
  } else {
    localCache.removeItem(Cache.DeskTop_List)
  }
})

const debouncedStorage = debounce((state) => {
  localCache.setItem(Cache.DeskTop_List, state.desktopList)
}, 800)
