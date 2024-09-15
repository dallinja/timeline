export function roundToDec(value: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

export function roundDataToDecimals<T>(data: T, decimals: number = 0): T {
  if (typeof data === 'number') {
    // Round the number to the specified decimals
    const factor = Math.pow(10, decimals)
    return (Math.round(data * factor) / factor) as T
  } else if (Array.isArray(data)) {
    // If it's an array, recursively process each element
    return data.map((item) => roundDataToDecimals(item, decimals)) as T
  } else if (typeof data === 'object' && data !== null) {
    // If it's an object, recursively process each key
    const result: any = {}
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        result[key] = roundDataToDecimals((data as any)[key], decimals)
      }
    }
    return result
  } else {
    // If it's neither a number nor an object/array, return it as is
    return data
  }
}
