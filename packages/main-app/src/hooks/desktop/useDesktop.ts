import { multiply, cloneDeep } from 'lodash-es'
import { calcElementWidth } from '@/utils/dom'
import { useLayoutStore } from '@/stores/layout'
import { useSortable } from '@/hooks/useSortable'
import { useDesktopStore } from '@/stores/desktop'
import { useDesktopGlobal } from '@/hooks/useGlobal'
import type { App, DesktopSortOptions, MoveOriginalEvent } from '@/types/desktop'
import type Sortable from 'sortablejs'

const desktopStore = useDesktopStore()
const { appCSSConstant, appSize } = useDesktopGlobal()

export const useDesktop = (desktopHeight: Ref<string>, desktopRef: Ref, apps: App[]) => {
  const layoutStore = useLayoutStore()

  const desktopWidth = calcElementWidth(desktopRef.value)
  const calcHeight = window.innerHeight - layoutStore.noDesktopLayoutHeight
  desktopHeight.value = `calc(${calcHeight}px)`

  const __gridGapX = parseInt(appCSSConstant.value.gridGapX)
  const __width = parseInt(appSize.value.width)
  const horizontalAppTotal = Math.floor((desktopWidth + __gridGapX) / (__gridGapX + __width))

  const __gridGapY = parseInt(appCSSConstant.value.gridGapY)
  const __height = parseInt(appSize.value.height)
  const verticalAppTotal = Math.floor((calcHeight + __gridGapY) / (__gridGapY + __height))

  apps.splice(multiply(horizontalAppTotal, verticalAppTotal), apps.length)
}

const DELAY = 1000
let draggedId = ''
let draggedOffsetX = 0
let draggedOffsetY = 0
let draggedIndex = 0
let relatedIndex = -1
let timer: NodeJS.Timeout | null = null
let moveX = 0
let moveY = 0

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onMoveHandler = (evt: any, list: App[], withFolder: boolean) => {
  if (desktopStore.dragStatus !== '0') return
  if (list[draggedIndex].isFolder && !withFolder) desktopStore.dragStatus = '1'
  // 拖拽为文件，且目标为文件夹
  if (!list[draggedIndex].isFolder && list[relatedIndex].isFolder) {
    nextTick(() => {
      list[draggedIndex].isShow = false
      desktopStore.dragStatus = '2'
    })
    return
  }

  const { originalEvent, relatedRect } = evt
  const RATIO = 0.6
  const mergeArea = relatedRect.width * relatedRect.height * RATIO
  const intersectionArea = calculateIntersectionArea(originalEvent, relatedRect)

  if (intersectionArea > mergeArea) {
    list[relatedIndex].isFolder = true

    // 需要等待folderModal中dom更新完毕
    nextTick(() => {
      list[draggedIndex].isShow = false
      desktopStore.dragStatus = '2'
    })
  } else {
    const relatedApp = cloneDeep(list[relatedIndex])
    list[relatedIndex] = list[draggedIndex]
    list[draggedIndex] = relatedApp

    desktopStore.dragStatus = '1'
  }
}

const onMove = (
  evt: Sortable.MoveEvent,
  originalEvent: MoveOriginalEvent,
  list: App[],
  withFolder: boolean,
  sortablejs: Sortable
) => {
  relatedIndex = Array.from(evt.to.children).indexOf(evt.related)
  if (list[relatedIndex].id !== desktopStore.relatedId) {
    desktopStore.relatedId = list[relatedIndex].id
  }

  // 只有不在同一位置停留时才清除定时器
  if (timer && moveX !== originalEvent.clientX && moveY !== originalEvent.clientY) {
    clearTimeout(timer)
    timer = null
    moveX = originalEvent.clientX
    moveY = originalEvent.clientY
  }
  if (!timer) {
    timer = setTimeout(() => {
      timer = null
      onMoveHandler(evt, list, withFolder)
      sortablejs.options.onMove?.(evt, originalEvent)
      desktopStore.dragStatus = '0'
    }, DELAY)
  }

  if (desktopStore.dragStatus === '1') {
    return true
  } else if (desktopStore.dragStatus === '2') {
    return false
  }

  return false
}

export const useDesktopSortable = ({
  element,
  list,
  options,
  withFolder = true
}: DesktopSortOptions) => {
  const sortablejs = useSortable(element, {
    ...options,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onStart: (evt: any) => {
      const {
        originalEvent: { offsetX, offsetY }
      } = evt

      draggedOffsetX = offsetX
      draggedOffsetY = offsetY
      draggedIndex = evt.oldIndex
      draggedId = list.find((app, i) => i === draggedIndex)?.id || ''
      if (draggedId !== desktopStore.draggedId) {
        desktopStore.draggedId = draggedId
      }

      desktopStore.isDragging = true
    },
    onMove: (evt: Sortable.MoveEvent, originalEvent: MoveOriginalEvent) =>
      onMove(evt, originalEvent, list, withFolder, sortablejs),
    onEnd: () => {
      desktopStore.isDragging = false
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    }
  })
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
