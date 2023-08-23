import { useDesktopStore } from '@/stores/desktop'
import { FOLDER_CLASS_NAME, APP_CLASS_NAME } from '@/types/desktopSortableConstant'
import { excludeElement, containsElement } from '@/utils/dom'
import { useDesktopSortableReactive } from './useDesktopSortableReactive'
import type Sortable from 'sortablejs'
import type { SortableEventOption } from '@/types/sortable'
import type { App, MoveOriginalEvent, SortableConstant } from '@/types/desktop'

const desktopStore = useDesktopStore()
const {
  dragged,
  related,
  desktop,
  draggedIndex,
  relatedIndex,
  currentDesktopIndex,
  draggedApp,
  desktopList
} = useDesktopSortableReactive()

const DELAY = 700

export const useDesktopSortableMove = () => {
  const move = (
    evt: SortableEventOption,
    originalEvent: MoveOriginalEvent,
    list: App[],
    constant: SortableConstant
  ) => {
    const { from, to, related: sortRelated } = evt
    const fromClassName = from.className
    const toClassName = to.className
    // 拖拽元素从弹窗到桌面
    const isModalToDesktop = fromClassName === FOLDER_CLASS_NAME && toClassName === APP_CLASS_NAME
    const isModalToModal = fromClassName === FOLDER_CLASS_NAME && toClassName === FOLDER_CLASS_NAME

    desktopStore.related.desktopIndex = currentDesktopIndex.value
    constant.isDeleteDraggedApp = false

    const relatedIndex = getIndexOfRelated(to.children, sortRelated)

    // 跨桌面拖动会导致目标桌面排序新增一个元素，所以需要重新计算目标元素的索引
    const isSameLevelDragged =
      dragged.value.desktopIndex === related.value.desktopIndex && toClassName === fromClassName

    if ((isSameLevelDragged && !isModalToModal) || isModalToDesktop) {
      setDesktopStoreRelated(list, evt, relatedIndex, constant, false)
    } else {
      handleNonSameLevelDragged(evt, relatedIndex, constant, list)
    }

    updateDragStatus(evt, originalEvent, constant)

    return desktopStore.dragStatus === '1' ? true : false
  }

  return {
    move
  }
}

const handleNonSameLevelDragged = (
  evt: SortableEventOption,
  relatedIndex: number,
  constant: SortableConstant,
  list: App[]
) => {
  const { to, related: sortRelated, dragged: sortDragged } = evt

  // 列表中不存在拖拽
  if (!containsElement(to.children, sortDragged)) {
    let beforeSortRelatedIndex = getIndexOfRelated(
      excludeElement(to.children, sortDragged),
      sortRelated
    )

    if (evt.willInsertAfter) {
      beforeSortRelatedIndex++
    }

    setDesktopStoreRelated(list, evt, beforeSortRelatedIndex, constant)
  } else {
    const draggedIndex = getIndexOfRelated(evt.to.children, sortDragged)
    const isLeftToRight = draggedIndex < relatedIndex

    if (isLeftToRight) {
      relatedIndex = evt.willInsertAfter ? relatedIndex : relatedIndex - 1
    } else {
      relatedIndex = evt.willInsertAfter ? relatedIndex + 1 : relatedIndex
    }

    setDesktopStoreRelated(list, evt, relatedIndex, constant)
  }
}

const updateDragStatus = (
  evt: SortableEventOption,
  originalEvent: MoveOriginalEvent,
  constant: SortableConstant
) => {
  if (desktopStore.openFolder && desktopStore.openFolder.isOpen) {
    desktopStore.dragStatus = '1'
    return true
  }

  const isNotSameLocation =
    constant.moveX !== originalEvent.clientX && constant.moveY !== originalEvent.clientY

  if (constant.timer && isNotSameLocation) {
    clearTimeout(constant.timer)
    constant.timer = null
    constant.moveX = originalEvent.clientX
    constant.moveY = originalEvent.clientY
  }
  if (!constant.timer) {
    constant.timer = setTimeout(() => {
      onMoveHandler(evt, constant)
    }, DELAY)
  }
}

const onMoveHandler = (evt: SortableEventOption, constant: SortableConstant) => {
  if (desktopStore.dragStatus !== '0' || draggedApp.value.isFolder) {
    desktopStore.dragStatus = '1'
    return
  }

  if (shouldMerge(evt, constant)) {
    nextTick(() => {
      desktopStore.dragStatus = '2'
    })
  }

  desktopStore.dragStatus = '1'
}

const shouldMerge = (evt: SortableEventOption, constant: SortableConstant) => {
  const { originalEvent, relatedRect } = evt
  const RATIO = 0.5
  const mergeArea = relatedRect.width * relatedRect.height * RATIO
  const intersectionArea = calculateIntersectionArea(originalEvent, relatedRect, constant)

  // 只有不是弹窗内的拖拽才会触发合并
  if (
    !desktopStore.openFolder.isOpen &&
    desktopList.value[related.value.desktopIndex as number].child[relatedIndex.value] &&
    intersectionArea > mergeArea
  ) {
    desktopList.value[related.value.desktopIndex as number].child[relatedIndex.value].isFolder =
      true
    return true
  }

  return false
}

const getIndexOfRelated = (children: HTMLCollection | Element[], related: HTMLElement) =>
  Array.from(children).indexOf(related)

const setDesktopStoreRelated = (
  list: App[],
  evt: SortableEventOption,
  index: number,
  constant: SortableConstant,
  isSameLevelDragged = true
) => {
  const draggedItem = list[draggedIndex.value]

  if (evt.to.className === APP_CLASS_NAME) {
    setConstantsForApp(constant, index)
  } else {
    setConstantsForNonApp(constant, index)
  }

  if (shouldUpdateNewItem(constant, draggedItem, isSameLevelDragged)) {
    updateNewItem(constant, draggedItem, evt)
  }

  if (constant.newItem) {
    updateDesktopStoreRelated(constant, index)
  }
}

const setConstantsForApp = (constant: SortableConstant, index: number) => {
  constant.newItem = desktop.value[index]
  constant.relatedList = desktop.value
}

const setConstantsForNonApp = (constant: SortableConstant, index: number) => {
  const openFolderIndex = desktop.value.findIndex((item) => item.id === desktopStore.openFolder.id)
  constant.newItem = desktop.value[openFolderIndex as number]?.child?.value[index] || null
  constant.relatedList =
    openFolderIndex > -1 ? desktop.value[openFolderIndex as number]?.child?.value || [] : []
}

const shouldUpdateNewItem = (
  constant: SortableConstant,
  draggedItem: App,
  isSameLevelDragged: boolean
) => {
  return (
    isSameLevelDragged &&
    !constant.newItem &&
    draggedItem &&
    constant.relatedList?.findIndex((item) => item.id === draggedItem.id) === -1 &&
    (desktopStore.openFolder.isOpen || dragged.value.desktopIndex !== related.value.desktopIndex)
  )
}

const updateNewItem = (constant: SortableConstant, draggedItem: App, evt: SortableEventOption) => {
  constant.newItem = {
    id: draggedItem.id,
    title: draggedItem.title,
    img: draggedItem.img,
    isFolder: draggedItem.isFolder,
    child: draggedItem.child ? draggedItem.child : undefined,
    parentId: evt.to.className === APP_CLASS_NAME ? undefined : constant.relatedList[0]?.parentId
  }
  constant.isDeleteDraggedApp = true
}

const updateDesktopStoreRelated = (constant: SortableConstant, index: number) => {
  desktopStore.related.index = index
  desktopStore.related.id = constant.newItem?.id
  desktopStore.related.inFolder = Boolean(constant.newItem?.parentId)
  if (constant.newItem?.parentId) {
    desktopStore.related.parentId = constant.newItem?.parentId
  }
}

const calculateIntersectionArea = (
  originalEvent: MouseEvent,
  relatedRect: Sortable.DOMRect,
  constant: SortableConstant
): number => {
  relatedRect.height - constant.draggedOffsetY
  const moveLeft = originalEvent.clientX - constant.draggedOffsetX
  const moveRight = moveLeft + relatedRect.width
  const moveTop = originalEvent.clientY - constant.draggedOffsetY
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
