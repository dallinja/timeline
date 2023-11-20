// export function keyBy<T>(array: T[], key: keyof T | ((item: T) => keyof T)) {
//   const collection: Partial<Record<T[keyof T], T>> = {}

//   if (typeof key === 'function') {
//     array.forEach((item) => {
//       collection[key(item)] = item
//     })
//   } else {
//     array.forEach((item) => {
//       collection[item[key]] = item
//     })
//   }

//   return collection
// }

export function keyBy<T extends Record<string, any>>(array: T[], key: keyof T) {
  const collection: Partial<Record<T[keyof T], T>> = {}

  array.forEach((item) => {
    collection[item[key]] = item
  })

  return collection
}
