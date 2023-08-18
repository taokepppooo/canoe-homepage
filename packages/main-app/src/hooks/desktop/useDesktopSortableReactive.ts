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
  const draggedOffsetX = ref(0)
  const draggedOffsetY = ref(0)
  const moveX = ref(0)
  const moveY = ref(0)
  const isDeleteDraggedApp = ref(false)
  const timer = ref<NodeJS.Timeout | null>(null)
  const newItem = ref<App | null>(null)
  const relatedList = reactive<App[]>([])

  return {
    draggedIndex,
    relatedIndex,
    dragged,
    related,
    currentDesktopIndex,
    desktop,
    draggedApp,
    desktopList,
    draggedOffsetX,
    draggedOffsetY,
    moveX,
    moveY,
    isDeleteDraggedApp,
    timer,
    newItem,
    relatedList
  }
}
