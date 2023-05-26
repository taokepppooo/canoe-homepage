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
