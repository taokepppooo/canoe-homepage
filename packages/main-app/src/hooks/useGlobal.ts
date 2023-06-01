import type { AppCSSConstant, AppSize } from '@/types/desktop'

export const useDesktopGlobal = () => {
  const appCSSConstant = ref<AppCSSConstant>({
    borderRadius: '10px',
    gridGapX: '0',
    gridGapY: '5px'
  })

  const appSize = ref<AppSize>({
    containerWidth: '100px',
    containerHeight: '90px',
    width: '60px',
    height: '60px'
  })

  return {
    appCSSConstant,
    appSize
  }
}
