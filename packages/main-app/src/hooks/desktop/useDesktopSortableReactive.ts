import { useDesktopStore } from '@/stores/desktop'
import { useDesktopAppStore } from '@/stores/desktopApp'
import type { App } from '@/types/desktop'

const desktopStore = useDesktopStore()
const desktopAppStore = useDesktopAppStore()

export const useDesktopSortableReactive = () => {
  const draggedIndex = computed(() => desktopStore.dragged.index as number)
  const relatedIndex = computed(() => desktopStore.related.index as number)
  const dragged = computed(() => desktopStore.dragged)
  const related = computed(() => desktopStore.related)
  const currentDesktopIndex = computed(() => desktopStore.currentDesktop.index as number)
  const desktop = computed(() => desktopAppStore.desktopList[currentDesktopIndex.value].child)
  const draggedApp = computed(
    () =>
      desktopList.value[dragged.value.desktopIndex as number].child[draggedIndex.value as number]
  )
  const desktopList = computed(() => desktopAppStore.desktopList)

  return {
    draggedIndex,
    relatedIndex,
    dragged,
    related,
    currentDesktopIndex,
    desktop,
    draggedApp,
    desktopList
  }
}
