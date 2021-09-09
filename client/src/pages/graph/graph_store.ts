import cytoscape from 'cytoscape'
import { sum } from 'lodash'
import { makeAutoObservable, runInAction } from 'mobx'
import { server_post } from '../../server_connector'
import { setup_async_loaders } from '../../utils/async_loaders'

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
              id: generate_id(table_name, row.id)
            },
          }))
      )


    const edges = this.data.behaviour_motivators.map((row: any) => {
      return {
        data: {
          source: generate_id('motivators', row.motivator_id),
          target: generate_id('behaviours', row.behaviour_id),
        },
      }
    })

    return [...nodes, ...edges]
  }
}

const generate_id = (table_name, id) => `${table_name}${id}`

export const graph_store = ((window as any).graph_store = new GraphStore())
