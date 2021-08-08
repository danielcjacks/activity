/**
 * Like a map, but works on deeply nested objects and arrays. Processor function is run from the most deeply nested keys to the least deeply nested ones
 * @param item can be an object or array
 * @param processor this function will run on every object, array and primitive value found
 * @returns the mapped object
 */
export const deep_map = (item: any, processor: (value: any, path: (string | number)[]) => any, current_path: (string | number)[] = []): any => {
    let mapped_item
    if (Array.isArray(item)) {
        mapped_item = item.map((el, i) => {
            const new_path = [...current_path, i]
            const subitem = deep_map(el, processor, new_path)
            return subitem
        })
    } else if (typeof item === 'object') {
        mapped_item = Object.keys(item).reduce((acc, key) => {
            const new_path = [...current_path, key]
            //@ts-ignore
            const subitem = deep_map(item[key], processor, new_path)
            acc[key] = subitem
            return acc
        }, {} as Record<string, unknown>)
    } else {
        mapped_item = item
    }

    return processor(mapped_item, current_path)
}