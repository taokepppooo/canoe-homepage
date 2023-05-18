export const defaultNamespace = 'cm'

const _bem = (block: string, blockSuffix: string, element: string, modifier: string) => {
  const __namespace = useGetNamespace()

  let __cls = `${__namespace}-${block}`

  if (blockSuffix) {
    __cls += `-${blockSuffix}`
  }
  if (element) {
    __cls += `__${element}`
  }
  if (modifier) {
    __cls += `--${modifier}`
  }

  return __cls
}

export const useGetNamespace = () => {
  const __namespace = defaultNamespace

  return __namespace
}

export const useNamespace = (block: string) => {
  const b = (blockSuffix = '') => _bem(block, blockSuffix, '', '')
  const e = (element?: string) => (element ? _bem(block, '', element, '') : '')
  const m = (modifier?: string) => (modifier ? _bem(block, '', '', modifier) : '')
  const be = (blockSuffix?: string, element?: string) =>
    blockSuffix && element ? _bem(block, blockSuffix, element, '') : ''
  const bm = (blockSuffix?: string, modifier?: string) =>
    blockSuffix && modifier ? _bem(block, blockSuffix, '', modifier) : ''
  const em = (element?: string, modifier?: string) =>
    element && modifier ? _bem(block, '', element, modifier) : ''
  const bem = (blockSuffix?: string, element?: string, modifier?: string) =>
    blockSuffix && element && modifier ? _bem(block, blockSuffix, element, modifier) : ''

  return {
    b,
    e,
    m,
    be,
    bm,
    em,
    bem
  }
}
