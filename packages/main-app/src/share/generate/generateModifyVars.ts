import { resolve } from 'path'

export const generateModifyVars = () => {
  return {
    constant: `true; @import (reference) "${resolve('src/assets/global/constant.less')}";`
  }
}
