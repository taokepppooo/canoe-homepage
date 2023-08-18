import { useDesktopStore } from '@/stores/desktop'
import { FOLDER_CLASS_NAME, APP_CLASS_NAME } from '@/types/desktopSortableConstant'
import { useDesktopSortableReactive } from './useDesktopSortableReactive'
import type Sortable from 'sortablejs'
import type { SortableEventOption } from '@/types/sortable'
import type { App, MoveOriginalEvent } from '@/types/desktop'

const desktopStore = useDesktopStore()
let {
  dragged,
  related,
  desktop,
  draggedIndex,
  relatedIndex,
  currentDesktopIndex,
  draggedApp,
  desktopList,
  isDeleteDraggedApp,
  moveX,
  moveY,
  timer,
  newItem,
  relatedList,
  draggedOffsetX,
  draggedOffsetY
} = useDesktopSortableReactive()

const DELAY = 700

export const useDesktopSortableMove = () => {
  const move = (evt: SortableEventOption, originalEvent: MoveOriginalEvent, list: App[]) => {
    desktopStore.related.desktopIndex = currentDesktopIndex.value
    // 跨桌面拖动会导致目标桌面排序新增一个元素，所以需要重新计算目标元素的索引
    const isSameLevelDragged =
      dragged.value.desktopIndex === related.value.desktopIndex &&
      evt.to.className === evt.from.className
    let relatedIndex = getIndexOfRelated(evt.to.children, evt.related)
    isDeleteDraggedApp.value = false
    // 拖拽元素从弹窗到桌面
    const isModalToDesktop =
      evt.from.className === FOLDER_CLASS_NAME && evt.to.className === APP_CLASS_NAME
    const isModalToModal =
      evt.from.className === FOLDER_CLASS_NAME && evt.to.className === FOLDER_CLASS_NAME

    if ((isSameLevelDragged && !isModalToModal) || isModalToDesktop) {
      setDesktopStoreRelated(list, evt, relatedIndex, false)
    } else {
      // 列表中不存在拖拽
      if (!containsElement(evt.to.children, evt.dragged)) {
        let beforeSortRelatedIndex = getIndexOfRelated(
          excludeElement(evt.to.children, evt.dragged),
          evt.related
        )

        if (evt.willInsertAfter) {
          beforeSortRelatedIndex++
        }

        setDesktopStoreRelated(list, evt, beforeSortRelatedIndex)
      } else {
        const draggedIndex = getIndexOfRelated(evt.to.children, evt.dragged)
        const isLeftToRight = draggedIndex < relatedIndex

        if (isLeftToRight) {
          relatedIndex = evt.willInsertAfter ? relatedIndex : relatedIndex - 1
        } else {
          relatedIndex = evt.willInsertAfter ? relatedIndex + 1 : relatedIndex
        }

        setDesktopStoreRelated(list, evt, relatedIndex)
      }
    }

    if (desktopStore.openFolder && desktopStore.openFolder.isOpen) {
      desktopStore.dragStatus = '1'
      return true
    }

    const isNotSameLocation =
      moveX.value !== originalEvent.clientX && moveY.value !== originalEvent.clientY

    if (timer.value && isNotSameLocation) {
      clearTimeout(timer.value)
      timer.value = null
      moveX.value = originalEvent.clientX
      moveY.value = originalEvent.clientY
    }
    if (!timer.value) {
      timer.value = setTimeout(() => {
        onMoveHandler(evt)
      }, DELAY)
    }

    if (desktopStore.dragStatus === '1') {
      return true
    }

    return false
  }

  return {
    move
  }
}

const onMoveHandler = (evt: SortableEventOption) => {
  if (desktopStore.dragStatus !== '0') return
  // 拖拽元素为文件夹，或者拖拽元素和目标元素的父级相同
  if (draggedApp.value.isFolder) {
    desktopStore.dragStatus = '1'
    return
  }

  const mergeFunc = () => {
    nextTick(() => {
      desktopStore.dragStatus = '2'
    })
  }

  const { originalEvent, relatedRect } = evt
  const RATIO = 0.5
  const mergeArea = relatedRect.width * relatedRect.height * RATIO
  const intersectionArea = calculateIntersectionArea(originalEvent, relatedRect)

  // 只有不是弹窗内的拖拽才会触发合并
  if (
    !desktopStore.openFolder.isOpen &&
    desktopList.value[related.value.desktopIndex as number].child[relatedIndex.value] &&
    intersectionArea > mergeArea
  ) {
    desktopList.value[related.value.desktopIndex as number].child[relatedIndex.value].isFolder =
      true
    mergeFunc()
  }

  desktopStore.dragStatus = '1'
}

// 在HTMLCollection中排除某个元素
const excludeElement = (
  htmlCollection: HTMLCollection,
  elementToExclude: HTMLElement
): Element[] => {
  const newArray: Element[] = []

  for (let i = 0; i < htmlCollection.length; i++) {
    if (htmlCollection[i] !== elementToExclude) {
      newArray.push(htmlCollection[i] as Element)
    }
  }

  return newArray
}
const containsElement = (htmlCollection: HTMLCollection, element: HTMLElement) => {
  for (let i = 0; i < htmlCollection.length; i++) {
    if (htmlCollection[i] === element) {
      return true
    }
  }
  return false
}
const getIndexOfRelated = (children: HTMLCollection | Element[], related: HTMLElement) =>
  Array.from(children).indexOf(related)

const setDesktopStoreRelated = (
  list: App[],
  evt: SortableEventOption,
  index: number,
  isSameLevelDragged = true
) => {
  const draggedItem = list[draggedIndex.value]

  if (evt.to.className === APP_CLASS_NAME) {
    newItem.value = desktop.value[index]
    relatedList = desktop.value
  } else {
    const openFolderIndex = desktop.value.findIndex(
      (item) => item.id === desktopStore.openFolder.id
    )
    newItem.value = desktop.value[openFolderIndex as number]?.child?.value[index] || null
    relatedList =
      openFolderIndex > -1 ? desktop.value[openFolderIndex as number]?.child?.value || [] : []
  }

  // length未插入和插入再拖拽
  if (
    isSameLevelDragged &&
    !newItem.value &&
    draggedItem &&
    relatedList?.findIndex((item) => item.id === draggedItem.id) === -1 &&
    (desktopStore.openFolder.isOpen || dragged.value.desktopIndex !== related.value.desktopIndex)
  ) {
    newItem.value = {
      id: draggedItem.id,
      title: draggedItem.title,
      img: draggedItem.img,
      isFolder: draggedItem.isFolder,
      child: draggedItem.child ? draggedItem.child : undefined,
      parentId: evt.to.className === APP_CLASS_NAME ? undefined : relatedList[0]?.parentId
    }

    isDeleteDraggedApp.value = true
  }

  if (newItem.value) {
    desktopStore.related.index = index
    desktopStore.related.id = newItem.value.id
    desktopStore.related.inFolder = Boolean(newItem.value.parentId)
  }
}

const calculateIntersectionArea = (
  originalEvent: MouseEvent,
  relatedRect: Sortable.DOMRect
): number => {
  relatedRect.height - draggedOffsetY.value
  const moveLeft = originalEvent.clientX - draggedOffsetX.value
  const moveRight = moveLeft + relatedRect.width
  const moveTop = originalEvent.clientY - draggedOffsetY.value
  const moveBottom = moveTop + relatedRect.height
  const clientX = originalEvent.clientX
  const clientY = originalEvent.clientY
  const {
    left: relatedLeft,
    right: relatedRight,
    top: relatedTop,
    bottom: relatedBottom
  } = relatedRect

  if (
    clientX > relatedLeft &&
    clientX < relatedRight &&
    clientY > relatedTop &&
    clientY < relatedBottom
  ) {
    // 计算两个正方形相交的面积
    const overlapX = Math.max(
      0,
      Math.min(moveRight, relatedRight) - Math.max(moveLeft, relatedLeft)
    )

    const overlapY = Math.max(
      0,
      Math.min(moveBottom, relatedBottom) - Math.max(moveTop, relatedTop)
    )

    return overlapX * overlapY
  }

  return 0
}
