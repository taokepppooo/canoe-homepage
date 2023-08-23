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

export interface Desktop {
  id: string
  name: string
  child: Array<App>
}

export interface App {
  id: string
  title: string
  img: string
  isFolder: boolean
  child?: ChildApp
  parentId?: string
}

export interface DesktopSortOptions {
  element: HTMLElement
  list: App[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: any
}

// 0: 初始化 1: 拖拽 2: 合并文件夹
export type DragStatus = '0' | '1' | '2'

export type MoveOriginalEvent = Event & MouseEvent

export type Direction = 'left' | 'right' | ''

export type DeskTopDirection = 'prev' | 'next' | ''

export interface SortableConstant {
  draggedOffsetX: number
  draggedOffsetY: number
  moveX: number
  moveY: number
  isDeleteDraggedApp: boolean
  timer: NodeJS.Timeout | null
  newItem: App | null
  relatedList: App[]
}

export interface SortableInfo {
  id?: string
  index?: number
  desktopIndex?: number
  parentId?: string
  inFolder?: boolean
}

export interface OpenFolder {
  id?: string
  index?: number // NOTE: index在数据删除或增加时不准确，需要根据id查询索引
  desktopIndex?: number
  isOpen?: boolean
}

export interface DesktopDragInfo {
  id?: string
  index?: number // 在list中所在的索引
}

export interface State {
  dragged: SortableInfo
  related: SortableInfo
  openFolder: OpenFolder
  currentDesktop: DesktopDragInfo
  oldDesktop: DesktopDragInfo
  isDragging: boolean
  dragStatus: DragStatus
  desktopSortableList: string[] // 桌面排序列表
}
