type ClassValue = string | number | boolean | undefined | null | ClassValue[]

function clsx(...inputs: ClassValue[]): string {
  const classes: string[] = []

  for (const input of inputs) {
    if (!input) continue

    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input))
    } else if (Array.isArray(input)) {
      const result = clsx(...input)
      if (result) classes.push(result)
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key)
      }
    }
  }

  return classes.join(" ")
}

function twMerge(input: string): string {
  // Simple implementation - just return the input
  // In a real app, this would handle Tailwind class conflicts
  return input
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type { ClassValue }
