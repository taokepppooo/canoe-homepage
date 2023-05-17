export const calculateElementDistance = (
  ref: ComponentPublicInstance | null,
  targetRef: ComponentPublicInstance | null
): number => {
  const rect1 = ref?.$el.getBoundingClientRect() || 0
  const rect2 = targetRef?.$el.getBoundingClientRect() || 0

  const distance = rect2.top - rect1.bottom

  return distance
}
