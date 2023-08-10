import { useSortable } from '@/hooks/useSortable'
import { useDesktopStore } from '@/stores/desktop'
import { useDesktopAppStore } from '@/stores/desktopApp'
import { useDesktopGlobal } from '@/hooks/useGlobal'
import { defaultNamespace } from '@/hooks/useNamespace'
import type { App, DesktopSortOptions, MoveOriginalEvent } from '@/types/desktop'
import type Sortable from 'sortablejs'

interface SortableOptions {
  originalEvent: MouseEvent
}

type SortableEventOption = Sortable.MoveEvent & SortableOptions & Sortable.SortableEvent

const desktopStore = useDesktopStore()
const desktopAppStore = useDesktopAppStore()
const { appSize } = useDesktopGlobal()

const DELAY = 700
const IN_MODAL_DELAY = 100
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
const relatedApp = computed(
  () => desktopList.value[related.value.desktopIndex as number].child[relatedIndex.value as number]
)
const desktopList = computed(() => desktopAppStore.desktopList)
let timer: NodeJS.Timeout | null = null
let moveX = 0
let moveY = 0

const onMoveHandler = (evt: SortableEventOption, list: App[]) => {
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

    // 只有不是弹窗内的拖拽才会触发合并
    if (!desktopStore.openFolder.isOpen && intersectionArea > mergeArea) {
      desktopList.value[related.value.desktopIndex as number].child[relatedIndex.value].isFolder =
        true
      mergeFunc()
    }
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
const getIndexOfRelated = (children: HTMLCollection | Element[], related: HTMLElement) =>
  Array.from(children).indexOf(related)

const setDesktopStoreRelated = (index: number) => {
  const relatedItem = desktop.value[index]

  desktopStore.related.index = index
  desktopStore.related.id = relatedItem.id
  desktopStore.related.inFolder = Boolean(relatedItem.parentId)
}

const onMove = (evt: SortableEventOption, originalEvent: MoveOriginalEvent, list: App[]) => {
  desktopStore.related.desktopIndex = currentDesktopIndex.value

  // 跨桌面拖动会导致目标桌面排序新增一个元素，所以需要重新计算目标元素的索引
  const isSameLevelDragged =
    dragged.value.desktopIndex === related.value.desktopIndex || desktopStore.openFolder.isOpen

  if (isSameLevelDragged) {
    const relatedIndex = getIndexOfRelated(evt.to.children, evt.related)

    setDesktopStoreRelated(relatedIndex)
  } else {
    let beforeSortRelatedIndex = getIndexOfRelated(
      excludeElement(evt.to.children, evt.dragged),
      evt.related
    )
    // 跨桌面拖动时，未插入元素的位置索引
    // 因为跨桌面时向前向后插入元素时，索引变化不同，所以需要重新计算索引
    const noInsertDraggedElementIndex = getIndexOfRelated(evt.to.children, evt.related)

    const isLeftToRight =
      noInsertDraggedElementIndex > beforeSortRelatedIndex &&
      beforeSortRelatedIndex < desktop.value.length - 1

    if (isLeftToRight) {
      beforeSortRelatedIndex++
    }

    setDesktopStoreRelated(beforeSortRelatedIndex)

    // 跨桌面拖动时，未插入元素的位置索引, 所以未插入元素的位置索引需要加2才等于当前元素长度
    // 最后元素前和后index都一致所以isLeftToRight判定只有从右到左才执行特殊赋值操作
    if (beforeSortRelatedIndex + 2 === evt.to.children.length && !isLeftToRight) {
      desktopStore.related.index = evt.to.children.length - 1
    } else {
      desktopStore.related.index = beforeSortRelatedIndex
    }
  }

  const isNotSameLocation = moveX !== originalEvent.clientX && moveY !== originalEvent.clientY

  if (timer && isNotSameLocation) {
    clearTimeout(timer)
    timer = null
    moveX = originalEvent.clientX
    moveY = originalEvent.clientY
  }
  if (!timer) {
    if (desktopStore.openFolder.isOpen) {
      timer = setTimeout(() => {
        onMoveHandler(evt, list)
      }, IN_MODAL_DELAY)
    } else {
      timer = setTimeout(() => {
        onMoveHandler(evt, list)
      }, DELAY)
    }
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
      desktopStore.isDragging = false

      // 使用更具描述性的变量名
      const fromClass = evt.from.className
      const toClass = evt.to.className

      if (desktopStore.dragStatus === '1') {
        if (isModalToModal(list)) {
          handleModalToModal(list, evt)
        } else if (isDesktopToFolder()) {
          handleListAppToFolder(list, evt)
        } else if (isDragInFolderModal(fromClass, toClass)) {
          handleDragInFolderModal()
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

const removeEmptyFolder = (parentId: string) => {
  const child = desktopList.value[currentDesktopIndex.value]?.child
  if (child) {
    const emptyFolderIndex = child.findIndex((item) => item.id === parentId)
    const modalChild = child[emptyFolderIndex]?.child?.value || []
    if (emptyFolderIndex !== -1 && modalChild.length < 1) {
      child.splice(emptyFolderIndex, 1)
    }
  }
}
const isModalToModal = (list: App[]) => {
  if (!desktopStore.openFolder.isOpen) {
    return
  }
  if (!list[draggedIndex.value].parentId) {
    return
  }

  return isRelatedAppInFolder()
}
const handleModalToModal = (list: App[], evt: Sortable.SortableEvent) => {
  const parentId = list[draggedIndex.value].parentId as string
  handleListAppToFolder(list, evt)
  removeEmptyFolder(parentId)
}
const isDesktopToFolder = () => {
  if (!desktopStore.openFolder.isOpen) {
    return
  }
  if (draggedApp.value.parentId) {
    return
  }

  return isRelatedAppInFolder()
}
// 将sortable接收参数的list中的拖拽app移动到文件夹中
const handleListAppToFolder = (list: App[], evt: Sortable.SortableEvent) => {
  if (
    desktopList &&
    desktopList.value &&
    desktopStore &&
    desktopStore.openFolder &&
    desktopList.value[desktopStore.openFolder.desktopIndex as number]?.child &&
    desktopList.value[desktopStore.openFolder.desktopIndex as number]?.child[
      desktopStore.openFolder.index as number
    ]?.child &&
    desktopList.value[desktopStore.openFolder.desktopIndex as number]?.child[
      desktopStore.openFolder.index as number
    ]?.child?.value
  ) {
    const draggedApp = list[draggedIndex.value]
    draggedApp.parentId =
      desktopList.value[desktopStore.openFolder.desktopIndex as number].child[
        desktopStore.openFolder.index as number
      ].id

    desktopList.value[desktopStore.openFolder.desktopIndex as number].child[
      desktopStore.openFolder.index as number
    ].child?.value.splice(relatedIndex.value, 0, draggedApp)
    removeDraggedItemFromList(list)
    // 解决拖拽文件夹内到外时，会有dom残留的bug
    evt.to.removeChild(evt.item)
  }
}
const isRelatedAppInFolder = () => {
  const openFolderList =
    desktopList.value[desktopStore.openFolder.desktopIndex as number]?.child[
      desktopStore.openFolder.index as number
    ]?.child?.value || []

  const relatedModalApp =
    relatedIndex.value <= openFolderList.length - 1
      ? openFolderList[relatedIndex.value]
      : openFolderList[relatedIndex.value - 1]

  return relatedModalApp.parentId
}
const isDragInFolderModal = (fromClass: string, toClass: string) => {
  return fromClass === toClass && relatedApp.value && relatedApp.value.parentId
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
  const parentId = list[draggedIndex.value].parentId as string
  delete list[draggedIndex.value].parentId

  evt.newIndex && desktop.value.splice(evt.newIndex, 0, list[draggedIndex.value])
  removeDraggedItemFromList(list)
  // 解决拖拽文件夹内到外时，会有dom残留的bug
  evt.to.removeChild(evt.item)
  removeEmptyFolder(parentId)
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
