import { prisma } from '../src/server'
import fs from 'fs'
import sqlstring from 'sqlstring'


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

const get_insert_table_name = table_name => table_name[0].toUpperCase() + table_name.slice(1, Infinity)

const insert_tables = Object.keys(json_schema).map(table_name => get_insert_table_name(table_name))


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

    const directory = get_hydration_file_directory(table_name)
    const file_contents = `${JSON.stringify(rows, undefined, 4)}`

    fs.writeFileSync(directory, file_contents, { encoding: 'utf8' })
  })
}

export const hydrate = async () => {
  try {

    const table_names = insert_tables

    const results = table_names.map(table_name => {
      const directory = get_hydration_file_directory(table_name)
      const rows = fs.existsSync(directory)
        ? JSON.parse(fs.readFileSync(directory, { encoding: 'utf8' }))
        : []
      return rows
    })

    // disable foreign key constraints so we dont have to delete/insert in the right order
    const disable_triggers = table_names.map(table_name => `ALTER TABLE "${table_name}" DISABLE TRIGGER ALL`)
    const delete_statements = table_names.map(table_name => `TRUNCATE "${table_name}" CASCADE`)
    const insert_statements = table_names.map((table_name, i) => results[i].length > 0
      ? generate_insert_statements(results[i], table_name)
      : null
    )
    const enable_triggers = table_names.map(table_name => `ALTER TABLE "${table_name}" ENABLE TRIGGER ALL`)
    // reset id sequences so that postgres autogenerating ids works properly
    const reset_id_sequences = Object.keys(json_schema)
      .filter(table_name => json_schema[table_name].includes('id'))
      .map(table_name =>
        `SELECT setval(pg_get_serial_sequence('"${get_insert_table_name(table_name)}"', 'id'), coalesce(max(id)+1, 1), false) FROM "${get_insert_table_name(table_name)}"`
      )

    // not using a transaction, but its just hydration so thats fine
    await Promise.all(disable_triggers.map(s => prisma.$executeRaw(s)))
    await Promise.all(delete_statements.map(s => prisma.$executeRaw(s)))
    await Promise.all(insert_statements.map(s => s ? prisma.$executeRaw(s) : null))
    await Promise.all(enable_triggers.map(s => prisma.$executeRaw(s)))
    await Promise.all(reset_id_sequences.map(s => prisma.$executeRaw(s)))
  }
  catch (error) {
    debugger
  }
}

const generate_insert_statements = (records: Record<string, unknown>[], table_name: string) => {
  // get insert keys by combining the keys from all records
  const insert_keys = records.reduce((acc, record, i) => {

    const keys_to_insert = Object.keys(record)
    keys_to_insert.forEach(key => acc.add(key))

    return acc
  }, new Set() as Set<string>)

  const values = records.map(record => {
    // @ts-ignore
    const record_values = [...insert_keys].map(key => record[key] ?? null)
    return record_values
  })

  // @ts-ignore

  const key_names = [...insert_keys]
  const sql_values = sqlstring.escape(values) // escape function puts () and ,

  const sql = `INSERT INTO "${table_name}"(${key_names}) VALUES ${sql_values}`
  return sql
}

const get_hydration_file_directory = (table_name: string) => `${__dirname}/../hydration/${table_name}_hydration.json`
