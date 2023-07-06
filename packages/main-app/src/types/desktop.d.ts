import type Sortable from 'sortablejs'

export interface AppCSSConstant {
  borderRadius: string
  gridGapX: string
  gridGapY: string
}

export interface AppSize {
  width: string
  height: string
}

export interface ChildApp {
  name: string
  value: Array<App>
}

export interface App {
  id: string
  title: string
  img: string
  isFolder: boolean
  child?: ChildApp
  appDragIndex?: number
}

export interface DesktopSortOptions {
  element: HTMLElement
  list: App[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: any
  withFolder?: boolean
}

type DragStatus = '0' | '1' | '2'

interface MoveEvent extends Sortable.MoveEvent {
  _timer: NodeJS.Timeout | null
}

type MoveOriginalEvent = Event & MouseEvent
