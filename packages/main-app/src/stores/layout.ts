export const useLayoutStore = defineStore('layout', {
  state: (): State => ({
    noDesktopLayoutHeight: 0
  })
})

interface State {
  noDesktopLayoutHeight: number
}
