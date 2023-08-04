import { useSortable } from '@/hooks/useSortable'
import { useDesktopStore } from '@/stores/desktop'
import { useDesktopAppStore } from '@/stores/desktopApp'
import { useDesktopGlobal } from '@/hooks/useGlobal'
import { defaultNamespace } from '@/hooks/useNamespace'
import type { App, DesktopSortOptions, MoveOriginalEvent } from '@/types/desktop'
import type Sortable from 'sortablejs'

const desktopStore = useDesktopStore()
const desktopAppStore = useDesktopAppStore()
const { appSize } = useDesktopGlobal()

const DELAY = 700
let draggedOffsetX = 0
let draggedOffsetY = 0
const draggedIndex = computed(() => desktopStore.dragged.index as number)
const relatedIndex = computed(() => desktopStore.related.index as number)
const dragged = computed(() => desktopStore.dragged)
const related = computed(() => desktopStore.related)
const currentDesktopIndex = computed(() => desktopStore.currentDesktop.index as number)
const desktop = computed(() => desktopAppStore.desktopList[currentDesktopIndex.value].child)
const relatedApp = computed(
  () => desktopList.value[related.value.deskTopIndex as number].child[relatedIndex.value as number]
)
const desktopList = computed(() => desktopAppStore.desktopList)
let timer: NodeJS.Timeout | null = null
let moveX = 0
let moveY = 0

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onMoveHandler = (evt: any, list: App[]) => {
  if (desktopStore.dragStatus !== '0') return
  if (
    list[draggedIndex.value].isFolder ||
    (list[draggedIndex.value].parentId &&
      relatedApp.value.parentId &&
      list[draggedIndex.value].parentId === relatedApp.value.parentId)
  ) {
    desktopStore.dragStatus = '1'
    return
  }

  const mergeFunc = () => {
    nextTick(() => {
      desktopStore.dragStatus = '2'
    })
  }

  // 目标为文件夹
  if (relatedApp.value.isFolder) {
    // 拖拽为文件
    if (!list[draggedIndex.value].isFolder) {
      mergeFunc()
    }
  } else {
    const { originalEvent, relatedRect } = evt
    const RATIO = 0.5
    const mergeArea = relatedRect.width * relatedRect.height * RATIO
    const intersectionArea = calculateIntersectionArea(originalEvent, relatedRect)

    if (intersectionArea > mergeArea) {
      desktopList.value[related.value.deskTopIndex as number].child[relatedIndex.value].isFolder =
        true
      mergeFunc()
    }
  }

  desktopStore.dragStatus = '1'
}

const onMove = (evt: Sortable.MoveEvent, originalEvent: MoveOriginalEvent, list: App[]) => {
  desktopStore.related.index = Array.from(evt.to.children).indexOf(evt.related)
  desktopStore.related.id = desktop.value[relatedIndex.value].id
  desktopStore.related.deskTopIndex = currentDesktopIndex.value

  const isNotSameLocation = moveX !== originalEvent.clientX && moveY !== originalEvent.clientY

  if (timer && isNotSameLocation) {
    clearTimeout(timer)
    timer = null
    moveX = originalEvent.clientX
    moveY = originalEvent.clientY
  }
  if (!timer) {
    timer = setTimeout(() => {
      onMoveHandler(evt, list)
    }, DELAY)
  }

  if (desktopStore.dragStatus !== '1') {
    return false
  }
}

// 只适用于首页桌面和首页桌面文件夹内的拖拽
export const useDesktopSortable = ({ element, list, options }: DesktopSortOptions) => {
  useSortable(element, {
    ...options,
    forceFallback: false,
    sort: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onStart: (evt: any) => {
      const {
        originalEvent: { offsetX, offsetY }
      } = evt

      desktopStore.dragged.deskTopIndex = desktopStore.currentDesktop.index
      desktopStore.isDragging = true
      draggedOffsetX = offsetX
      draggedOffsetY = offsetY
      desktopStore.dragged.index = evt.oldIndex

      const draggedId = list[draggedIndex.value].id || ''
      if (draggedId !== desktopStore.dragged.id) {
        desktopStore.dragged.id = draggedId
      }
    },
    onMove: (evt: Sortable.MoveEvent, originalEvent: MoveOriginalEvent) =>
      onMove(evt, originalEvent, list),
    onEnd: (evt: Sortable.SortableEvent) => {
      desktopStore.isDragging = false

      // 使用更具描述性的变量名
      const fromClass = evt.from.className
      const toClass = evt.to.className

      if (desktopStore.dragStatus === '1') {
        if (isDragInFolderModal(fromClass, toClass)) {
          handleDragInFolderModal()
        } else if (isDragFromModalToOutside(fromClass, toClass, list)) {
          handleDragFromModalToOutside(list, evt)
        } else if (isDragToDifferentElementDesktop()) {
          handleDragToDifferentElementDesktop(list)
        } else {
          swapElements(list)
        }
      }

      desktopStore.dragStatus = '0'

      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    }
  })
}

const isDragInFolderModal = (fromClass: string, toClass: string) => {
  return fromClass === toClass && relatedApp.value.parentId
}
const handleDragInFolderModal = () => {
  const index = desktop.value.findIndex((app) => app.id === relatedApp.value.parentId)
  // 弹窗内拖拽
  const apps = desktop.value[index].child?.value || []
  ;[apps[relatedIndex.value], apps[draggedIndex.value]] = [
    apps[draggedIndex.value],
    apps[relatedIndex.value]
  ]
}
const isDragFromModalToOutside = (fromClass: string, toClass: string, list: App[]) => {
  return (
    list[draggedIndex.value].parentId &&
    fromClass === `${defaultNamespace}-desktop-folder-modal-body__desktop__apps` &&
    toClass === `${defaultNamespace}-desktop-controller__apps`
  )
}
const handleDragFromModalToOutside = (list: App[], evt: Sortable.SortableEvent) => {
  delete list[draggedIndex.value].parentId

  evt.newIndex && desktop.value.splice(evt.newIndex, 0, list[draggedIndex.value])
  removeDraggedItemFromList(list)
  // 解决拖拽文件夹内到外时，会有dom残留的bug
  evt.to.removeChild(evt.item)
}
const removeDraggedItemFromList = (list: App[]) => {
  list.splice(draggedIndex.value, 1)
}
const isDragToDifferentElementDesktop = () => {
  return dragged.value.deskTopIndex !== related.value.deskTopIndex
}
const handleDragToDifferentElementDesktop = (list: App[]) => {
  // 拖拽的元素和目标元素不同
  desktopList.value[related.value.deskTopIndex as number].child.splice(
    relatedIndex.value,
    0,
    list[draggedIndex.value]
  )
  removeDraggedItemFromList(list)
}
const swapElements = (list: App[]) => {
  ;[list[relatedIndex.value], list[draggedIndex.value]] = [
    list[draggedIndex.value],
    list[relatedIndex.value]
  ]
}

const calculateIntersectionArea = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  originalEvent: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  relatedRect: any
): number => {
  const originalClientX = originalEvent.clientX - draggedOffsetX
  const originalClientY = originalEvent.clientY - draggedOffsetY
  const relatedX = relatedRect.left
  const relatedY = relatedRect.top

  // 计算两个正方形相交的面积
  const overlapX = Math.max(
    0,
    Math.min(
      originalClientX + parseInt(appSize.value.width),
      relatedX + parseInt(appSize.value.width)
    ) - Math.max(originalClientX, relatedX)
  )

  const overlapY = Math.max(
    0,
    Math.min(
      originalClientY + parseInt(appSize.value.height),
      relatedY + parseInt(appSize.value.height)
    ) - Math.max(originalClientY, relatedY)
  )

  const intersectionArea = overlapX * overlapY

  return intersectionArea
}
