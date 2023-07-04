import { multiply, debounce, cloneDeep } from 'lodash-es'
import { calcElementWidth } from '@/utils/dom'
import { useLayoutStore } from '@/stores/layout'
import { useSortable } from '@/hooks/useSortable'
import { useDesktopStore } from '@/stores/desktop'
import { useDesktopGlobal } from '@/hooks/useGlobal'
import type { App, DesktopSortOptions } from '@/types/desktop'

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

const delay = 1000
let draggedId = ''
let draggedIndex = 0
let draggedOffsetX = 0
let draggedOffsetY = 0
let relatedIndex = -1
let timer: any = null
let isMerge = '0'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onMoveHandler = (evt: any, list: App[], withFolder: boolean) => {
  if (list[draggedIndex].isFolder && !withFolder) isMerge = '1'

  const {
    originalEvent: { clientX, clientY },
    relatedRect
  } = evt
  const mergeArea = relatedRect.width * relatedRect.height * 0.6
  const intersectionArea = calculateIntersectionArea(
    clientX,
    clientY,
    draggedOffsetX,
    draggedOffsetY,
    relatedRect
  )

  if (intersectionArea > mergeArea) {
    if (draggedId !== desktopStore.draggedId) {
      desktopStore.draggedId = draggedId
    }
    list[relatedIndex].isFolder = true
    if (list[relatedIndex].id !== desktopStore.relatedId) {
      desktopStore.relatedId = list[relatedIndex].id
    }

    isMerge = '2'
  } else {
    isMerge = '1'
  }
}

const onMove = (evt, list, withFolder) => {
  relatedIndex = Array.from(evt.to.children).indexOf(evt.related)
  if (!timer) {
    timer = setTimeout(() => {
      onMoveHandler(evt, list, withFolder)
      clearTimeout(timer)
      timer = null
      isMerge = '0'
    }, delay)
  }

  if (timer && isMerge === '1') {
    return true
  } else if (timer && isMerge === '2') {
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

      desktopStore.isDragging = true
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMove: (evt: any) => onMove(evt, list, withFolder),
    onEnd: () => {
      desktopStore.isDragging = false

      const relatedApp = cloneDeep(list[relatedIndex])
      list[relatedIndex] = list[draggedIndex]
      list[draggedIndex] = relatedApp
    }
  })
}

const calculateIntersectionArea = (
  clientX: number,
  clientY: number,
  draggedOffsetX: number,
  draggedOffsetY: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  relatedRect: any
): number => {
  const draggedX = clientX - draggedOffsetX

  const draggedY = clientY - draggedOffsetY

  // 计算两个正方形相交的面积
  const overlapX = Math.max(
    Math.min(draggedX + relatedRect.width, relatedRect.left + relatedRect.width) -
      Math.max(draggedX, relatedRect.left),
    0
  )
  const overlapY = Math.max(
    Math.min(draggedY + relatedRect.height, relatedRect.top + relatedRect.height) -
      Math.max(draggedY, relatedRect.height),
    0
  )

  const intersectionArea = overlapX * overlapY

  return intersectionArea
}
