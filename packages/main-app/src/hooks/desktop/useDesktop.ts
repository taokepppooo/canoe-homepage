import { multiply } from 'lodash-es'
import { calcElementWidth } from '@/utils/dom'
import { useLayoutStore } from '@/stores/layout'

export const useDesktop = (
  desktopHeight: Ref<string>,
  desktopRef: Ref,
  gridGapX: string,
  width: string,
  gridGapY: string,
  height: string,
  apps: Ref<[{ [key: string]: object }]>
) => {
  const layoutStore = useLayoutStore()

  const desktopWidth = calcElementWidth(desktopRef.value)
  const calcHeight = window.innerHeight - layoutStore.noDesktopLayoutHeight
  desktopHeight.value = `calc(${calcHeight}px)`

  const __gridGapX = parseInt(gridGapX)
  const __width = parseInt(width)
  const horizontalAppTotal = Math.floor((desktopWidth + __gridGapX) / (__gridGapX + __width))

  const __gridGapY = parseInt(gridGapY)
  const __height = parseInt(height)
  const verticalAppTotal = Math.floor((calcHeight + __gridGapY) / (__gridGapY + __height))

  apps.value.splice(multiply(horizontalAppTotal, verticalAppTotal), apps.value.length)
}
