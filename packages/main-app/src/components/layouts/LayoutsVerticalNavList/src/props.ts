import type { ExtractPropTypes } from 'vue'
import type { LayoutNav } from './types'

export const layoutNavProps = {
  item: { type: Object as PropType<LayoutNav>, required: true },
  activeDefault: { type: String, default: '' }
}

export type layoutNavProps = ExtractPropTypes<typeof layoutNavProps>
