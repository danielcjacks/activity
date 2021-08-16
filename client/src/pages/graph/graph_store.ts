import { sum } from 'lodash'
import { makeAutoObservable } from 'mobx'
import { setup_async_loaders } from '../../utils/async_loaders'

class GraphStore {
  data = {
    motivators: [
      {
        id: 'v1',
        name: 'fitness',
        description: 'Stay healthy and active',
        importance: 4,
      },
      {
        id: 'v3',
        name: 'lose weight',
        importance: -2,
      },
      {
        id: 'v2',
        name: 'master a skill',
        description: '',
        importance: 1,
      },
    ],
    // goals: [{
    //   id: 'g1',
    //   name: 'Run 5k',
    // }, {
    //   id: 'g2',
    //   name: 'Do 25 pushups'
    // }, {
    //   id: 'g3',
    //   name: 'Lose 10 kg'
    // }],
    behaviour_motivators: [
      { motivator_id: 'v1', behaviour_id: 'b1' },
      { motivator_id: 'v1', behaviour_id: 'b2' },
      { motivator_id: 'v1', behaviour_id: 'b3' },
      { motivator_id: 'v2', behaviour_id: 'b4' },
      { motivator_id: 'v3', behaviour_id: 'b1' },
      // { motivator_id: 'v3', behaviour_id: 'b3' },
    ],
    behaviours: [
      {
        id: 'b1',
        name: 'Go running',
        description: '',
        behaviourEvents: [
          {
            timestamp: '2021-07-07T21:05:22Z',
          },
          {
            timestamp: '2021-06-07T21:05:22Z',
          },
          {
            timestamp: '2021-05-07T21:05:22Z',
          },
        ],
      },
      {
        id: 'b2',
        name: 'Do a warmup',
        behaviourEvents: [
          {
            timestamp: '2021-07-07T21:05:22Z',
          },
        ],
      },
      {
        id: 'b3',
        name: 'Practice pushups',
      },
      {
        id: 'b4',
        name: 'Practice guitar',
        behaviourEvents: [
          {
            timestamp: '2021-07-07T21:05:22Z',
          },
        ],
      },
    ],
  }

  constructor() {
    setup_async_loaders(this)
    makeAutoObservable(this)
  }

  get max_behaviour_events() {
    const behaviour_event_counts = this.data.behaviours.map(
      (behaviour) => behaviour.behaviourEvents?.length ?? 0
    )

    return sum(behaviour_event_counts)
  }

  get_cytoscape_elements = () => {
    const table_types: Record<string, 'node' | 'edge'> = {
      motivators: 'node',
      behaviours: 'node',
      behaviour_motivators: 'edge',
    }

    const nodes = Object.keys(this.data)
      .filter((table_name) => table_types[table_name] === 'node')
      .flatMap(
        (
          table_name // we want to combine all nodes into one list (thats how cytoscape takes them)
        ) =>
          this.data[table_name]?.map((row) => ({
            data: {
              ...row,
              // nodes are a flat list, so this is the only way to keep track of the table_name, which can be used for
              // conditional formatting
              _table_name: table_name,
            },
          }))
      )

    const edges = Object.keys(this.data)
      .filter((table_name) => table_types[table_name] === 'edge')
      .flatMap(
        (
          table_name // we want to combine all nodes into one list (thats how cytoscape takes them)
        ) => {
          const rows = this.data[table_name] ?? []
          const edges_from_this_table = rows.map((row) => {
            const row_keys = Object.keys(row)
            if (row_keys.length !== 2) {
              throw new Error('expected 2 row keys for an edge table')
            }

            const source_prop = row_keys[0]
            const target_prop = row_keys[1]

            return {
              data: {
                source: row[source_prop],
                target: row[target_prop],
              },
            }
          })

          return edges_from_this_table
        }
      )

    // // edges should be generated from the database. We may need schema changes to expose the AB tables
    // const edges = [
    //   { source: 'v1', target: 'g1' },
    //   { source: 'v1', target: 'g2' },
    //   { source: 'v1', target: 'g3' },
    //   { source: 'g1', target: 'b1' },
    //   { source: 'g1', target: 'b2' },
    //   { source: 'g2', target: 'b3' },
    // ].map((el) => ({ data: { ...el } }))

    return [...nodes, ...edges]
  }
}

export const graph_store = ((window as any).graph_store = new GraphStore())
