import { multiply, cloneDeep } from 'lodash-es'
import { calcElementWidth } from '@/utils/dom'
import { useLayoutStore } from '@/stores/layout'
import { useSortable } from '@/hooks/useSortable'
import { useDesktopStore } from '@/stores/desktop'
import { useDesktopAppStore } from '@/stores/desktopApp'
import { useDesktopGlobal } from '@/hooks/useGlobal'
import { defaultNamespace } from '@/hooks/useNamespace'
import type { App, DesktopSortOptions, MoveOriginalEvent } from '@/types/desktop'
import type Sortable from 'sortablejs'

const desktopStore = useDesktopStore()
const desktopAppStore = useDesktopAppStore()
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

  if (draggedId !== desktopStore.draggedId) {
    desktopStore.draggedId = draggedId
  }

  if (!withFolder) {
    desktopStore.dragStatus = '1'
    return true
  }

  if (list[relatedIndex].id !== desktopStore.relatedId) {
    desktopStore.relatedId = list[relatedIndex].id
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
      onMoveHandler(evt, list)
    }, DELAY)
  }

  if (desktopStore.dragStatus !== '1') {
    return false
  }
}

export const useDesktopSortable = ({
  element,
  list,
  options,
  withFolder = true
}: DesktopSortOptions) => {
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
      draggedId = list.find((app, i) => i === draggedIndex)?.id || ''

      desktopStore.isDragging = true
    },
    onMove: (evt: Sortable.MoveEvent, originalEvent: MoveOriginalEvent) =>
      onMove(evt, originalEvent, list, withFolder),
    onEnd: (evt: Sortable.MoveEvent) => {
      desktopStore.isDragging = false
      if (desktopStore.dragStatus === '1') {
        if (evt.from.className === evt.to.className && list[relatedIndex].parentId) {
          const index = desktopAppStore.apps.findIndex(
            (app) => app.isShow && app.id === list[relatedIndex].parentId
          )
          // 弹窗内拖拽
          const child = desktopAppStore.apps[index].child?.value || []
          const relatedApp = cloneDeep(child[relatedIndex])
          child[relatedIndex] = child[draggedIndex]
          child[draggedIndex] = relatedApp
        } else if (
          list[draggedIndex].parentId &&
          evt.from.className === `${defaultNamespace}-desktop-folder-modal-body__desktop__apps` &&
          evt.to.className === `${defaultNamespace}-desktop__apps`
        ) {
          // 弹窗内拖拽到谈窗外
          delete list[draggedIndex].parentId
          list[draggedIndex].isShow = true

          desktopAppStore.apps.splice(relatedIndex, 0, list[draggedIndex])
          list.splice(draggedIndex, 1)
        } else {
          const relatedApp = cloneDeep(list[relatedIndex])
          list[relatedIndex] = list[draggedIndex]
          list[draggedIndex] = relatedApp
        }
      }
      console.log(desktopAppStore.apps, 'desktopAppStore.apps')

      desktopAppStore.apps = desktopAppStore.apps.filter((app) => app.isShow)
      desktopStore.dragStatus = '0'

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
