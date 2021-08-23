import { prisma } from '../src/server'
import fs from 'fs'


/**
 * Prisma schema really should be parsable, but since its not we will have to maintain this separately
 */
const json_schema = {
  user: ['id', 'username', 'password'],
  motivator: ['id', 'user_id', 'name', 'description', 'positivity'],
  behaviourMotivator: ['behaviour_id', 'motivator_id'],
  behaviour: ['id', 'name', 'description', 'user_id'],
  behaviourEvent: ['id', 'behaviour_id', 'comment', 'time_stamp']
}

export const dehydrate = async () => {
  const table_names = Object.keys(json_schema)

  const queries = table_names.map(table_name => {
    const select = {}
    for (const column_name of json_schema[table_name]) {
      select[column_name] = true
    }

    return { select }
  })

  const table_results = await Promise.all(table_names.map((table_name, i) => 
    prisma[table_name].findMany(queries[i])
  ))

  table_names.forEach((table_name, i) => {
    const rows = table_results[i]

    const filename = `${table_name}_hydration.ts`
    const file_contents = `export const rows = ${JSON.stringify(rows, undefined, 4)}`

    fs.writeFileSync(`${__dirname}/../hydration/${filename}`, file_contents)
  })
}

export const hydrate = () => {

}
