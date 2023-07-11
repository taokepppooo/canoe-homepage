import Sortable from 'sortablejs'
import type { Options } from 'sortablejs'

export const useSortable = (el: HTMLElement, options?: Options) => {
  const init = (): Sortable => {
    return Sortable.create(unref(el), {
      animation: 300,
      scroll: true,
      scrollSensitivity: 30,
      scrollSpeed: 10,
      ...options
    })
  }

  return init()
}
