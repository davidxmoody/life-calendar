export default function bemModifiers(
  className: string,
  modifiers: Record<string, boolean>,
): string {
  let result = className

  Object.entries(modifiers).forEach(([key, value]) => {
    if (value) {
      result += ` ${className}--${key}`
    }
  })

  return result
}
