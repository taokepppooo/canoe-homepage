import { useSortable } from '@/hooks/useSortable'
import { useDesktopStore } from '@/stores/desktop'
import { useDesktopAppStore } from '@/stores/desktopApp'
import { defaultNamespace } from '@/hooks/useNamespace'
import type { App, DesktopSortOptions, MoveOriginalEvent } from '@/types/desktop'
import type Sortable from 'sortablejs'

interface SortableOptions {
  originalEvent: MouseEvent
}

type SortableEventOption = Sortable.MoveEvent & SortableOptions & Sortable.SortableEvent

const desktopStore = useDesktopStore()
const desktopAppStore = useDesktopAppStore()

const APP_CLASS_NAME = `${defaultNamespace}-desktop-controller__apps`
const FOLDER_CLASS_NAME = `${defaultNamespace}-desktop-folder-modal-body__desktop__apps`
const DELAY = 700
let draggedOffsetX = 0
let draggedOffsetY = 0
const draggedIndex = computed(() => desktopStore.dragged.index as number)
const relatedIndex = computed(() => desktopStore.related.index as number)
const dragged = computed(() => desktopStore.dragged)
const related = computed(() => desktopStore.related)
const currentDesktopIndex = computed(() => desktopStore.currentDesktop.index as number)
const desktop = computed(() => desktopAppStore.desktopList[currentDesktopIndex.value].child)
const draggedApp = computed(
  () => desktopList.value[dragged.value.desktopIndex as number].child[draggedIndex.value as number]
)
const desktopList = computed(() => desktopAppStore.desktopList)
let timer: NodeJS.Timeout | null = null
let moveX = 0
let moveY = 0
let isDeleteDraggedApp = false
let newItem: App | null = null
let relatedList: App[] = []

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
    newItem = desktop.value[index]
    relatedList = desktop.value
  } else {
    const openFolderIndex = desktop.value.findIndex(
      (item) => item.id === desktopStore.openFolder.id
    )
    newItem = desktop.value[openFolderIndex as number]?.child?.value[index] || null
    relatedList =
      openFolderIndex > -1 ? desktop.value[openFolderIndex as number]?.child?.value || [] : []
  }

  // length未插入和插入再拖拽
  if (
    isSameLevelDragged &&
    !newItem &&
    draggedItem &&
    relatedList?.findIndex((item) => item.id === draggedItem.id) === -1 &&
    (desktopStore.openFolder.isOpen || dragged.value.desktopIndex !== related.value.desktopIndex)
  ) {
    newItem = {
      id: draggedItem.id,
      title: draggedItem.title,
      img: draggedItem.img,
      isFolder: draggedItem.isFolder,
      child: draggedItem.child ? draggedItem.child : undefined,
      parentId: evt.to.className === APP_CLASS_NAME ? undefined : relatedList[0]?.parentId
    }

    isDeleteDraggedApp = true
  }

  if (newItem) {
    desktopStore.related.index = index
    desktopStore.related.id = newItem.id
    desktopStore.related.inFolder = Boolean(newItem.parentId)
  }
}

const onMove = (evt: SortableEventOption, originalEvent: MoveOriginalEvent, list: App[]) => {
  desktopStore.related.desktopIndex = currentDesktopIndex.value
  // 跨桌面拖动会导致目标桌面排序新增一个元素，所以需要重新计算目标元素的索引
  const isSameLevelDragged =
    dragged.value.desktopIndex === related.value.desktopIndex &&
    evt.to.className === evt.from.className
  let relatedIndex = getIndexOfRelated(evt.to.children, evt.related)
  isDeleteDraggedApp = false
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

  const isNotSameLocation = moveX !== originalEvent.clientX && moveY !== originalEvent.clientY

  if (timer && isNotSameLocation) {
    clearTimeout(timer)
    timer = null
    moveX = originalEvent.clientX
    moveY = originalEvent.clientY
  }
  if (!timer) {
    timer = setTimeout(() => {
      onMoveHandler(evt)
    }, DELAY)
  }

  if (desktopStore.dragStatus === '1') {
    return true
  }

  return false
}

// 只适用于首页桌面和首页桌面文件夹内的拖拽
export const useDesktopSortable = ({ element, list, options }: DesktopSortOptions) => {
  useSortable(element, {
    ...options,
    forceFallback: false,
    sort: true,
    onStart: (evt: SortableEventOption) => {
      const {
        originalEvent: { offsetX, offsetY }
      } = evt

      desktopStore.dragged.desktopIndex = desktopStore.currentDesktop.index
      desktopStore.isDragging = true
      draggedOffsetX = offsetX
      draggedOffsetY = offsetY
      desktopStore.dragged.index = evt.oldIndex

      const draggedId = list[draggedIndex.value].id || ''
      if (draggedId !== desktopStore.dragged.id) {
        desktopStore.dragged.id = draggedId
      }
      if (list[draggedIndex.value].parentId) {
        desktopStore.dragged.inFolder = true
      } else {
        desktopStore.dragged.inFolder = false
      }
    },
    onMove: (evt: SortableEventOption, originalEvent: MoveOriginalEvent) =>
      onMove(evt, originalEvent, list),
    onEnd: (evt: Sortable.SortableEvent) => {
      const openFolderIndex = desktop.value.findIndex(
        (item) => item.id === desktopStore.openFolder.id
      )
      desktopStore.isDragging = false

      // 使用更具描述性的变量名
      const fromClass = evt.from.className
      const toClass = evt.to.className

      if (desktopStore.dragStatus === '1') {
        if (isDeleteDraggedApp) {
          relatedList.splice(relatedIndex.value, 0, newItem as App)
          removeDraggedItemFromList(list)
          evt.to.removeChild(evt.item)
          isDeleteDraggedApp = false
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

      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    }
  })
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

const calculateIntersectionArea = (
  originalEvent: MouseEvent,
  relatedRect: Sortable.DOMRect
): number => {
  relatedRect.height - draggedOffsetY
  const moveLeft = originalEvent.clientX - draggedOffsetX
  const moveRight = moveLeft + relatedRect.width
  const moveTop = originalEvent.clientY - draggedOffsetY
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
