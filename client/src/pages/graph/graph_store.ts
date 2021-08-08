import { makeAutoObservable } from 'mobx'
import { setup_async_loaders } from '../../utils/async_loaders'

class GraphStore {
  data = {
    values: [{
      id: 'v1',
      name: 'fitness',
      description: 'Stay healthy and active',
      importance: 3
    }],
    goals: [{
      id: 'g1',
      name: 'Run 5k',
    }, {
      id: 'g2',
      name: 'Do 25 pushups asdasdasdasdadasdasdasdasdasd'
    }, {
      id: 'g3',
      name: 'Lose 10 kg'
    }],
    behaviours: [{
      id: 'b1',
      name: 'Go running',
      description: '',
      behaviourEvents: [{
        timestamp: '2021-07-07T21:05:22Z'
      }, {
        timestamp: '2021-06-07T21:05:22Z'
      }, {
        timestamp: '2021-05-07T21:05:22Z'
      }]
    }, {
      id: 'b2',
      name: 'Do a warmup',
      behaviourEvents: [{
        timestamp: '2021-07-07T21:05:22Z'
      }]
    }, {
      id: 'b3',
      name: 'Practice pushups'
    }]
  }

  constructor() {
    setup_async_loaders(this)
    makeAutoObservable(this)
  }

  get_cytoscape_elements = () => {
    const nodes = Object.keys(this.data).flatMap(table_name =>
      this.data[table_name]?.map(row => ({
        data: {
          ...row,
          _table_name: table_name // nodes are a flat list, so this says if a row is a value, goal etc.
        }
      }))
    )

    // edges should be generated from the database. We may need schema changes to expose the AB tables
    const edges = [
      { source: 'v1', target: 'g1' },
      { source: 'v1', target: 'g2' },
      { source: 'v1', target: 'g3' },
      { source: 'g1', target: 'b1' },
      { source: 'g1', target: 'b2' },
      { source: 'g2', target: 'b3' },
    ].map(el => ({ data: { ...el } }))

    return [...nodes, ...edges]
  }
}

export const graph_store = ((window as any).graph_store = new GraphStore())