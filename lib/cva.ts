// Simple replacement for class-variance-authority
export type VariantProps<T> = T extends (...args: any[]) => any ? Parameters<T>[0] : never

export function cva(
  base: string,
  config?: {
    variants?: Record<string, Record<string, string>>
    defaultVariants?: Record<string, string>
  },
) {
  return (props?: Record<string, any>) => {
    let classes = base

    if (config?.variants && props) {
      for (const [key, value] of Object.entries(props)) {
        if (value !== undefined && config.variants[key]?.[value]) {
          classes += ` ${config.variants[key][value]}`
        }
      }
    }

    if (config?.defaultVariants) {
      for (const [key, value] of Object.entries(config.defaultVariants)) {
        if (props?.[key] === undefined && config.variants?.[key]?.[value]) {
          classes += ` ${config.variants[key][value]}`
        }
      }
    }

    return classes
  }
}
