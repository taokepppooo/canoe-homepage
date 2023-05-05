import { resolve } from 'path'

export const generateModifyVars = () => {
  return {
    hack: `true; @import (reference) "${resolve('src/assets/index.less')}";`
  }
}
