import cytoscape from 'cytoscape'
import { random, sum } from 'lodash'
import { makeAutoObservable, runInAction } from 'mobx'
import { server_post } from '../../server_connector'
import { setup_async_loaders } from '../../utils/async_loaders'
import { cartesian } from '../../utils/math_utils'


class GraphStore {
  data = {
    motivators: [] as Record<string, any>[],
    behaviours: [] as Record<string, any>[], // includes behaviour_events
    behaviour_motivators: [] as Record<string, any>[],
  }

  cy?: cytoscape.Core

  constructor() {
    setup_async_loaders(this)
    makeAutoObservable(this, {
      cy: false
    })
  }

  get max_behaviour_events() {
    const behaviour_event_counts = this.data.behaviours.map(
      (behaviour) => behaviour.behaviour_events?.length ?? 0
    )

    return sum(behaviour_event_counts) || 0
  }

  fetch_data = async () => {
    const [motivators, behaviours, behaviour_motivators] = await Promise.all([
      server_post('/prisma/motivator/findMany', {}),
      server_post('/prisma/behaviour/findMany', {
        include: {
          behaviour_events: true
        }
      }),
      server_post('/prisma/behaviourMotivator/findMany', {})
    ])

    runInAction(() => {
      if (motivators) {
        motivators.sort((a, b) => (b.positivity || 0) - (a.positivity || 0))

        this.data.motivators = motivators
      }

      if (behaviours) {
        this.data.behaviours = behaviours
      }

      if (behaviour_motivators) {
        this.data.behaviour_motivators = behaviour_motivators
      }
    })
  }

  get_cytoscape_elements = () => {
    const axis_positions = ['bot', 'mid', 'top']
    const axes = ['x', 'y']

    const axis_nodes = cartesian(axis_positions, axes)
      .map(([axis_position, axis], i) => ({
        data: {
          id: `_${axis}_axis_${axis_position}`,
          type: 'axis_node',
          position: axis_position,
          axis
        },
        position: {
          x: i * 200,
          y: i * 200
        },
        selectable: false,
        immutable: true,
        // locked: true,
        grabbable: false,
        pannable: true
      }))

    const axis_edge_positions = [
      { source: 'mid', target: 'bot' },
      { source: 'mid', target: 'top' }
    ]

    const edge_labels = {
      y_mid_bot: 'Towards',
      y_mid_top: 'Away',
      x_mid_top: 'Behaviours',
      x_mid_bot: 'Motivators'
    }

    const axis_edges = cartesian(axis_edge_positions, axes)
      .map(([{ source, target }, axis]) => ({
        data: {
          source: `_${axis}_axis_${source}`,
          target: `_${axis}_axis_${target}`,
          type: 'axis_edge',
          label: edge_labels[`${axis}_${source}_${target}`],
          axis
        }
      }))

    const nodes = ['motivators', 'behaviours']
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
              id: generate_id(table_name, row.id),
              type: 'data'
            },
          }))
      )
      .concat(axis_nodes)


    const edges = this.data.behaviour_motivators.map((row: any) => {
      return {
        data: {
          source: generate_id('motivators', row.motivator_id),
          target: generate_id('behaviours', row.behaviour_id),
          type: 'data'
        },
      }
    }).concat(axis_edges)


    return [...nodes, ...edges]
  }
}

const generate_id = (table_name, id) => `${table_name}${id}`

export const graph_store = ((window as any).graph_store = new GraphStore())
