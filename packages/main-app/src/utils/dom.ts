export const calcElementHeight = (el: HTMLElement): number => {
  const offsetHeight = el.offsetHeight
  const style = window.getComputedStyle(el)
  const marginTop = parseInt(style.getPropertyValue('margin-top'))
  const marginBottom = parseInt(style.getPropertyValue('margin-bottom'))

  return offsetHeight + marginTop + marginBottom
}

export const calcElementWidth = (el: HTMLElement): number => {
  const offsetWidth = el.offsetWidth

  return offsetWidth
}

// 在HTMLCollection中排除某个元素
export const excludeElement = (
  htmlCollection: HTMLCollection,
  elementToExclude: HTMLElement
): Element[] => {
  const newArray: Element[] = []

  for (let i = 0; i < htmlCollection.length; i++) {
    if (htmlCollection[i] !== elementToExclude) {
      newArray.push(htmlCollection[i] as Element)
    }
  }

  return newArray
}
export const containsElement = (htmlCollection: HTMLCollection, element: HTMLElement) => {
  for (let i = 0; i < htmlCollection.length; i++) {
    if (htmlCollection[i] === element) {
      return true
    }
  }
  return false
}
