import { useDesktopGlobal } from '@/hooks/useGlobal'
import type { AppSize } from '@/types/desktop'

const { appCSSConstant, appSize } = useDesktopGlobal()

export const useDesktopApp = (gapRows: number | unknown, gapColumns: number | unknown) => {
  const _gapRows = ref((gapRows as number) || 1)
  const _gapColumns = ref((gapColumns as number) || 1)

  let size = ref(appSize.value)
  if (_gapRows.value && _gapColumns.value) {
    if (_gapRows.value !== 1 && _gapColumns.value !== 1) {
      size = ref<AppSize>({
        width: `${
          parseInt(appSize.value.width) * _gapColumns.value +
          (_gapColumns.value - 1) * parseInt(appCSSConstant.value.gridGapX)
        }px`,
        height: `${
          parseInt(appSize.value.height) * _gapRows.value +
          (_gapRows.value - 1) * parseInt(appCSSConstant.value.gridGapY)
        }px`
      })
    }
  }

  return {
    gapRows: _gapRows.value,
    gapColumns: _gapColumns.value,
    size
  }
}
