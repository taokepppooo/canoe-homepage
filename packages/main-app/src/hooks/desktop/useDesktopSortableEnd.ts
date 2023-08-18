import { useDesktopStore } from '@/stores/desktop'
import { FOLDER_CLASS_NAME, APP_CLASS_NAME } from '@/types/desktopSortableConstant'
import { useDesktopSortableReactive } from './useDesktopSortableReactive'
import type Sortable from 'sortablejs'
import type { App } from '@/types/desktop'

const desktopStore = useDesktopStore()
const {
  dragged,
  related,
  desktop,
  draggedIndex,
  relatedIndex,
  desktopList,
  isDeleteDraggedApp,
  timer,
  newItem,
  relatedList
} = useDesktopSortableReactive()

export const useDesktopSortableEnd = () => {
  const end = (evt: Sortable.SortableEvent, list: App[]) => {
    const openFolderIndex = desktop.value.findIndex(
      (item) => item.id === desktopStore.openFolder.id
    )
    desktopStore.isDragging = false

    // 使用更具描述性的变量名
    const fromClass = evt.from.className
    const toClass = evt.to.className

    if (desktopStore.dragStatus === '1') {
      if (isDeleteDraggedApp) {
        relatedList.splice(relatedIndex.value, 0, newItem.value as App)
        removeDraggedItemFromList(list)
        evt.to.removeChild(evt.item)
        isDeleteDraggedApp.value = false
        if (isModalToModal(fromClass, toClass) && list.length === 0) {
          removeEmptyFolder()
        }
      } else if (isDesktopToFolder(list, openFolderIndex)) {
        handleListAppToFolder(list, evt, openFolderIndex)
      } else if (isDragFromModalToOutside(fromClass, toClass, list)) {
        handleDragFromModalToOutside(list, evt)
      } else if (isDragToDifferentElementDesktop()) {
        handleDragToDifferentElementDesktop(list)
      } else {
        sortElements(list)
      }
    }

    desktopStore.dragStatus = '0'

    if (timer.value) {
      clearTimeout(timer.value)
      timer.value = null
    }
  }

  return {
    end
  }
}

const removeEmptyFolder = () => {
  const child = desktopList.value[dragged.value.desktopIndex as number]?.child
  if (child) {
    const emptyFolderIndex = child.findIndex((item) => item.child && item.child.value.length === 0)
    if (emptyFolderIndex > -1) {
      child.splice(emptyFolderIndex, 1)
    }
  }
}
const isModalToModal = (fromClass: string, toClass: string) => {
  if (!desktopStore.openFolder.isOpen) {
    return
  }

  return fromClass === FOLDER_CLASS_NAME && toClass === FOLDER_CLASS_NAME
}
const isDesktopToFolder = (list: App[], openFolderIndex: number) => {
  if (!desktopStore.openFolder.isOpen) {
    return
  }

  if (list[draggedIndex.value] && list[draggedIndex.value].parentId) {
    return
  }

  return isRelatedAppInFolder(openFolderIndex)
}
// 将sortable接收参数的list中的拖拽app移动到文件夹中
const handleListAppToFolder = (
  list: App[],
  evt: Sortable.SortableEvent,
  openFolderIndex: number
) => {
  if (
    desktopList &&
    desktopList.value &&
    desktopStore &&
    desktopStore.openFolder &&
    desktopList.value[desktopStore.openFolder.desktopIndex as number]?.child &&
    desktopList.value[desktopStore.openFolder.desktopIndex as number]?.child[openFolderIndex]
      ?.child &&
    desktopList.value[desktopStore.openFolder.desktopIndex as number]?.child[openFolderIndex]?.child
      ?.value
  ) {
    const draggedApp = list[draggedIndex.value]
    draggedApp.parentId =
      desktopList.value[desktopStore.openFolder.desktopIndex as number].child[openFolderIndex].id

    desktopList.value[desktopStore.openFolder.desktopIndex as number].child[
      openFolderIndex
    ].child?.value.splice(relatedIndex.value, 0, draggedApp)
    removeDraggedItemFromList(list)
    // 解决拖拽文件夹内到外时，会有dom残留的bug
    evt.to.removeChild(evt.item)
  }
}
const isRelatedAppInFolder = (openFolderIndex: number) => {
  const openFolderList =
    desktopList.value[desktopStore.openFolder.desktopIndex as number]?.child[openFolderIndex]?.child
      ?.value || []

  const relatedModalApp =
    relatedIndex.value <= openFolderList.length - 1
      ? openFolderList[relatedIndex.value]
      : openFolderList[relatedIndex.value - 1]

  return relatedModalApp && relatedModalApp.parentId
}
const isDragFromModalToOutside = (fromClass: string, toClass: string, list: App[]) => {
  return (
    list[draggedIndex.value].parentId &&
    fromClass === FOLDER_CLASS_NAME &&
    toClass === APP_CLASS_NAME
  )
}
const handleDragFromModalToOutside = (list: App[], evt: Sortable.SortableEvent) => {
  delete list[draggedIndex.value].parentId

  evt.newIndex && desktop.value.splice(evt.newIndex, 0, list[draggedIndex.value])
  removeDraggedItemFromList(list)
  // 解决拖拽文件夹内到外时，会有dom残留的bug
  evt.to.removeChild(evt.item)
  removeEmptyFolder()
}
const removeDraggedItemFromList = (list: App[]) => {
  list.splice(draggedIndex.value, 1)
}
const isDragToDifferentElementDesktop = () => {
  return dragged.value.desktopIndex !== related.value.desktopIndex
}
const handleDragToDifferentElementDesktop = (list: App[]) => {
  // 拖拽的元素和目标元素不同
  desktopList.value[related.value.desktopIndex as number].child.splice(
    relatedIndex.value,
    0,
    list[draggedIndex.value]
  )
  removeDraggedItemFromList(list)
}
const sortElements = (list: App[]) => {
  const draggedApp = list[draggedIndex.value]
  list.splice(draggedIndex.value, 1)
  list.splice(relatedIndex.value, 0, draggedApp)
}
