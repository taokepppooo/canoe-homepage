import type { Options } from 'sortablejs'

export const useSortable = (el: HTMLElement, options?: Options, swap = false) => {
  const init = async () => {
    if (!el) return

    const Sortable = (await import('sortablejs')).default

    if (swap) {
      const Swap = (await import('sortablejs')).Swap
      Sortable.mount(new Swap())
    }

    Sortable.create(unref(el), {
      animation: 300,
      scroll: true,
      scrollSensitivity: 30,
      scrollSpeed: 10,
      ...options
    })
  }

  init()
}
