export type VariantProps<T> = T extends (...args: any[]) => any ? Parameters<T>[0] : never

export function cva(base: string, config?: any) {
  return (props?: any) => {
    if (!config || !props) return base

    let classes = base

    if (config.variants) {
      Object.keys(props).forEach((key) => {
        const variant = config.variants[key]
        const value = props[key]
        if (variant && variant[value]) {
          classes += ` ${variant[value]}`
        }
      })
    }

    if (config.defaultVariants) {
      Object.keys(config.defaultVariants).forEach((key) => {
        if (props[key] === undefined) {
          const variant = config.variants[key]
          const defaultValue = config.defaultVariants[key]
          if (variant && variant[defaultValue]) {
            classes += ` ${variant[defaultValue]}`
          }
        }
      })
    }

    return classes
  }
}
