import type { AppCSSConstant, AppSize } from '@/types/desktop'

export const useDesktopGlobal = () => {
  const appCSSConstant = ref<AppCSSConstant>({
    borderRadius: '10px',
    gridGapX: '45px',
    gridGapY: '35px'
  })

  const appSize = ref<AppSize>({
    width: '60px',
    height: '60px'
  })

  return {
    appCSSConstant,
    appSize
  }
}
