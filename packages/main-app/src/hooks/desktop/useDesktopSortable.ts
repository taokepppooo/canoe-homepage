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
let draggedId = ''
let draggedOffsetX = 0
let draggedOffsetY = 0
let draggedIndex = 0
let relatedIndex = -1
let timer: NodeJS.Timeout | null = null
let moveX = 0
let moveY = 0

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onMoveHandler = (evt: any, list: App[]) => {
  if (desktopStore.dragStatus !== '0') return
  if (list[draggedIndex].isFolder) {
    desktopStore.dragStatus = '1'
    return
  }

  const mergeFunc = () => {
    list[draggedIndex].isShow = false
    nextTick(() => {
      desktopStore.dragStatus = '2'
    })
  }

  // 目标为文件夹
  if (list[relatedIndex].isFolder) {
    // 拖拽为文件
    if (!list[draggedIndex].isFolder) {
      mergeFunc()
      return
    } else {
      desktopStore.dragStatus = '1'
      return
    }
  }

  const { originalEvent, relatedRect } = evt
  const RATIO = 0.5
  const mergeArea = relatedRect.width * relatedRect.height * RATIO
  const intersectionArea = calculateIntersectionArea(originalEvent, relatedRect)

  if (intersectionArea > mergeArea) {
    list[relatedIndex].isFolder = true

    mergeFunc()
  } else {
    desktopStore.dragStatus = '1'
  }
}

const onMove = (
  evt: Sortable.MoveEvent,
  originalEvent: MoveOriginalEvent,
  list: App[],
  withFolder: boolean
) => {
  relatedIndex = Array.from(evt.to.children).indexOf(evt.related)

  if (!withFolder) {
    desktopStore.dragStatus = '1'
    return true
  }

  // DiffDesktopConditionExecutor(() => {}, () = {
  //   if (list[relatedIndex].id !== desktopStore.relatedId) {
  //     desktopStore.relatedId = list[relatedIndex].id
  //   }
  // }
  // )

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
export const useDesktopSortable = ({
  element,
  list,
  options,
  withFolder = true
}: DesktopSortOptions) => {
  const currentDesktopIndex = desktopAppStore.desktopList.findIndex(
    (desktop) => desktop.id === desktopStore.currentDesktopId
  )
  const currentOldDesktopIndex = desktopAppStore.desktopList.findIndex(
    (desktop) => desktop.id === desktopStore.oldCurrentDesktopId
  )

  const notSort = !desktopStore.desktopSortableList.includes(desktopStore.currentDesktopId)
  if (notSort) {
    desktopStore.desktopSortableList.push(desktopStore.currentDesktopId)
  }

  if (currentDesktopIndex >= 0) {
    const desktop = desktopAppStore.desktopList[currentDesktopIndex]
    useSortable(element, {
      ...options,
      forceFallback: false,
      sort: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onStart: (evt: any) => {
        const {
          originalEvent: { offsetX, offsetY }
        } = evt

        draggedOffsetX = offsetX
        draggedOffsetY = offsetY
        draggedIndex = evt.oldIndex
        // 解决拖拽文件夹内到外时，list未更新导致的bug
        if (!list[draggedIndex].parentId) {
          list = desktop.child
        }
        draggedId = list[draggedIndex].id || ''
        if (draggedId !== desktopStore.draggedId) {
          desktopStore.draggedId = draggedId
        }
        desktopStore.isDragging = true
      },
      onMove: (evt: Sortable.MoveEvent, originalEvent: MoveOriginalEvent) =>
        onMove(evt, originalEvent, list, withFolder),
      onEnd: (evt: Sortable.SortableEvent) => {
        desktopStore.isDragging = false
        if (desktopStore.dragStatus === '1') {
          if (evt.from.className === evt.to.className && list[relatedIndex].parentId) {
            const index = desktop.child.findIndex(
              (app) => app.isShow && app.id === list[relatedIndex].parentId
            )
            // 弹窗内拖拽
            const apps = desktop.child[index].child?.value || []
            ;[apps[relatedIndex], apps[draggedIndex]] = [apps[draggedIndex], apps[relatedIndex]]
          } else if (
            list[draggedIndex].parentId &&
            evt.from.className === `${defaultNamespace}-desktop-folder-modal-body__desktop__apps` &&
            evt.to.className === `${defaultNamespace}-desktop-controller__apps`
          ) {
            // 弹窗内拖拽到谈窗外
            delete list[draggedIndex].parentId
            list[draggedIndex].isShow = true

            evt.newIndex && desktop.child.splice(evt.newIndex, 0, list[draggedIndex])
            list.splice(draggedIndex, 1)
            // 解决拖拽文件夹内到外时，会有dom残留的bug
            evt.to.removeChild(evt.item)
          } else {
            ;[list[relatedIndex], list[draggedIndex]] = [list[draggedIndex], list[relatedIndex]]
          }
        }
        desktop.child = desktop.child.filter((app) => app.isShow)
        desktopStore.dragStatus = '0'

        if (timer) {
          clearTimeout(timer)
          timer = null
        }
      }
    })
  }
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

const DiffDesktopConditionExecutor = (trueFunc, falseFunc) => {
  console.log(
    desktopStore.oldCurrentDesktopId &&
      desktopStore.currentDesktopId !== desktopStore.oldCurrentDesktopId,
    'desktopStore.currentDesktopId !== desktopStore.oldCurrentDesktopId'
  )
  console.log(desktopStore.currentDesktopId)
  console.log(desktopStore.oldCurrentDesktopId)
  if (
    desktopStore.oldCurrentDesktopId &&
    desktopStore.currentDesktopId !== desktopStore.oldCurrentDesktopId
  ) {
    trueFunc()
  } else {
    falseFunc()
  }
}
