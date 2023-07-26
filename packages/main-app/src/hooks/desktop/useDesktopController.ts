export const useDesktopController = (ref: Ref) => {
  const { elementPositionX, elementPositionY, elementHeight, elementWidth, isOutside } =
    useMouseInElement(ref)

  watch(
    () => isOutside.value,
    (val) => {
      console.log(val, 'isOutside')
    }
  )
  return ''
}
