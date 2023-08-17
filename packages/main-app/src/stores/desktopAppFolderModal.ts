export const useDesktopAppFolderModalStore = defineStore('desktopAppFolderModal', {
  state: (): State => ({
    // NODE: 第一次合并打开文件夹时，避免出现关闭弹窗问题
    isFirstMergeOpen: false
  })
})

interface State {
  isFirstMergeOpen: boolean
}
