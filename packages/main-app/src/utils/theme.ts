// TODO: 后期考虑是否可以在storage中或者状态中取
export const setTheme = (color: string) => {
  const element = document.documentElement
  const classes = element.classList
  const className = element.className

  const regex = /^theme-/
  const theme = `theme-${color}`

  if (!regex.test(className)) {
    classes.add(theme)
    return
  }

  for (let i = classes.length - 1; i >= 0; i--) {
    const className = classes.item(i) || ''

    if (regex.test(className) && className !== theme) {
      classes.replace(className, theme)
    }
  }
}
