import { debounce } from 'lodash-es'
import { Cache } from '@/utils/cache'
import { CacheEnum } from '@/types/enum'
import type { Desktop } from '@/types/desktop'

export const useDesktopAppStore = defineStore('desktopApp', {
  state: (): State => ({
    desktopList: []
  })
})

interface State {
  desktopList: Desktop[]
}

const cache = new Cache()

useDesktopAppStore().$subscribe((_mutation, state) => {
  if (state.desktopList.length) {
    console.log(state, 'state')
    debouncedStorage(state)
  } else {
    cache.removeItem(CacheEnum.DeskTop_List)
  }
})

const debouncedStorage = debounce((state) => {
  cache.setItem(CacheEnum.DeskTop_List, state.desktopList)
}, 800)
