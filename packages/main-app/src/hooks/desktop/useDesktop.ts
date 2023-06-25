import { multiply, divide } from 'lodash-es'
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

export const useDesktopSortable = ({
  element,
  list,
  options,
  withFolder = true
}: DesktopSortOptions) => {
  const ContainerWidthToWidthDistance = divide(
    parseInt(appSize.value.containerWidth) - parseInt(appSize.value.width),
    2
  )
  const ContainerHeightToHeightDistance = divide(
    parseInt(appSize.value.containerHeight) - parseInt(appSize.value.height),
    2
  )

  let draggedId = ''
  useSortable(element, {
    ...options,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onStart: (evt: any) => {
      const index = evt.oldIndex
      draggedId = list.find((app, i) => i === index)?.id || ''
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMove: (evt: any) => {
      const {
        originalEvent: { clientX, clientY },
        relatedRect
      } = evt
      if (
        clientX > relatedRect.left + ContainerWidthToWidthDistance &&
        clientX < relatedRect.right - ContainerWidthToWidthDistance &&
        clientY > relatedRect.top + ContainerHeightToHeightDistance &&
        clientY < relatedRect.bottom - ContainerHeightToHeightDistance &&
        withFolder
      ) {
        if (draggedId !== desktopStore.draggedId) {
          desktopStore.draggedId = draggedId
        }

        dragHover(() => {
          const relatedIndex = Array.from(evt.to.children).indexOf(evt.related)
          list[relatedIndex].isFolder = true
          if (list[relatedIndex].id !== desktopStore.relatedId) {
            desktopStore.relatedId = list[relatedIndex].id
          }
        })

        return false
      } else {
        // 排序时会执行定时器中的函数，所以需要在这里清除定时器
        dragEnd()

        return sort(ContainerWidthToWidthDistance, ContainerHeightToHeightDistance, evt)
      }
    },
    onEnd: () => {
      dragEnd()
    }
  })
}

const sort = (
  ContainerWidthToWidthDistance: number,
  ContainerHeightToHeightDistance: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  evt: any
) => {
  const {
    originalEvent: { clientX, clientY },
    relatedRect,
    draggedRect
  } = evt
  const gridGapY = parseInt(appCSSConstant.value.gridGapY)
  const containerWidth = parseInt(appSize.value.containerWidth)

  const yRelatedScope =
    clientY > relatedRect.top + ContainerHeightToHeightDistance &&
    clientY < relatedRect.bottom - ContainerHeightToHeightDistance

  const isVerticalCrossing =
    clientY > draggedRect.bottom + gridGapY + ContainerHeightToHeightDistance ||
    clientY < draggedRect.top + gridGapY + ContainerHeightToHeightDistance

  const isSameColumn = relatedRect.left === draggedRect.left

  const isLeftOfDragged = clientX < draggedRect.left + ContainerWidthToWidthDistance
  const isRightOfDragged = clientX > draggedRect.right - ContainerWidthToWidthDistance
  const isTopOfRelatedRect = clientY < relatedRect.top + ContainerHeightToHeightDistance
  const isBottomRelatedRect = clientY > relatedRect.bottom - ContainerHeightToHeightDistance

  const isInsideHorizontalScopeRight =
    clientX > relatedRect.right - ContainerWidthToWidthDistance && yRelatedScope
  const isInsideHorizontalScopeLeft =
    clientX < relatedRect.left + ContainerWidthToWidthDistance && yRelatedScope

  const isRightMove = clientX > draggedRect.right
  const isLeftMove = clientX < draggedRect.left + containerWidth

  const horizontalMove = () => {
    if (isRightMove && isInsideHorizontalScopeRight) {
      return true
    }
    if (isLeftMove && isInsideHorizontalScopeLeft) {
      return true
    }

    return false
  }

  if (isVerticalCrossing) {
    if (isSameColumn) {
      const isVerticalTopMove =
        clientY < draggedRect.top &&
        clientX > relatedRect.left + ContainerWidthToWidthDistance &&
        clientX < relatedRect.right - ContainerWidthToWidthDistance
      return isVerticalTopMove
        ? isTopOfRelatedRect
        : isBottomRelatedRect || isLeftOfDragged || isRightOfDragged
    } else {
      return horizontalMove()
    }
  } else {
    return horizontalMove()
  }
}

let moveTime: NodeJS.Timeout
let lastMoveTime: number
const MERGE_TIME = 700
const dragHover = (fn: () => void) => {
  if (!lastMoveTime) {
    lastMoveTime = Date.now()
  }

  if (Date.now() - lastMoveTime > MERGE_TIME) {
    dragEnd()
    lastMoveTime = 0
    moveTime = setTimeout(() => {
      fn()
    }, MERGE_TIME)
  }
}
const dragEnd = () => {
  clearTimeout(moveTime)
}
