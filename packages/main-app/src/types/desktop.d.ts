export interface AppCSSConstant {
  borderRadius: string
  gridGapX: string
  gridGapY: string
}

export interface AppSize {
  containerWidth: string
  containerHeight: string
  width: string
  height: string
}

export interface App {
  id: string
  title: string
  img: string
  isFolder: boolean
  child?: Array<APP>
  appDragIndex?: number
}
