import { dropRight, findLast, first, last } from 'lodash'
import { deep_map } from '../utils/utils'


export type OwnershipPaths = {
    [table_name: string]: string[]
}

export type Path = (string | number)[]

export const add_query_ownership_clauses = (root_table: string, ownership_paths: OwnershipPaths, owner_column: string, owner_values: any[], prisma_query: Record<string, unknown>) => {

    const mapped_prisma_query = deep_map(prisma_query, (value, path) => {
        const table_name = last(path)?.toString()
        if (!is_table_name(table_name, ownership_paths)) {
            return value
        }

        const ownership_path = get_ownership_path(ownership_paths, table_name)
        const parent_table = first(ownership_path)
        const higher_table = findLast(
            dropRight(path, 1), // exclude current table, otherwise higher_table will always equal the current table
            el => is_table_name(el, ownership_paths) // only look for keys in the path that are table names. E.g. exclude 'where' or 'select'
        ) ?? root_table // if nothing is found, that means we are the child of the root table, so use that

        // if the higher table is the parent table, we dont need to do extra filtering. This is because prisma will already filter
        // this to be a child of the higher table, so we only need to put the extra where clause on the higher table
        if (parent_table === higher_table) {
            return value
        }

        const ownership_where = generate_ownership_where(ownership_path, owner_column, owner_values)

        // there might already be a where clause, but we dont want to lose that. So we combine the existing (if any) 
        // clause with the ownership clause
        const combined_where = combine_wheres([value.where, ownership_where], 'AND')

        // value could be true, since prisma allows nested selects like { goals: true } to select all columns on goals
        return typeof value === 'object'
            ? { ...value, where: combined_where }
            : { where: combined_where }
    })

    const root_ownership_path = get_ownership_path(ownership_paths, root_table)
    const root_where = generate_ownership_where(root_ownership_path, owner_column, owner_values)
    const combined_root_where = combine_wheres([root_where, prisma_query.where], 'AND')

    return {
        ...mapped_prisma_query,
        where: combined_root_where
    }
}

export const get_ownership_path = (ownership_paths: OwnershipPaths, table_name: string) => {
    if (ownership_paths[table_name]) {
        return ownership_paths[table_name]
    }

    throw new Error(`Could not find ownership path for table ${table_name}.`)
}

export const combine_wheres = (wheres: any[], connective: 'AND' | 'OR') => {
    const valid_wheres = wheres.filter(el => !!el)

    const combined_where = valid_wheres.length === 0 ? undefined
        : valid_wheres.length === 1 ? valid_wheres[0]
            : { [connective]: valid_wheres }

    return combined_where
}

export const is_table_name = (table_name: string | number, ownership_paths: OwnershipPaths) => {
    return Object.keys(ownership_paths).includes(table_name?.toString())
}

const generate_ownership_where = (ownership_path: string[], owner_column: string, owner_values: any[]) => {
    const inner_where = {
        [owner_column]: {
            in: owner_values
        }
    } as Record<string, unknown>

    // we will build the where clause from the bottom up, starting with the end of the ownership path and working to the beginning.
    // the .slice() makes a copy so that .reverse() doesnt mutate the original
    const ownership_where = ownership_path.slice().reverse().reduce((where, table_name) => {
        return {
            [table_name]: {
                is: where
            }
        }
    }, inner_where)

    return ownership_where
}