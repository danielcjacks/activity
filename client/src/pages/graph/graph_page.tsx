// @ts-nocheck
import { Grid } from '@material-ui/core'
import { observer } from 'mobx-react-lite'
import CytoscapeComponent from 'react-cytoscapejs'
import { graph_store } from './graph_store'
import dagre from 'cytoscape-dagre'
import cytoscape from 'cytoscape'
import { lerp } from '../../utils/math_utils'

cytoscape.use(dagre)

export const GraphPage = observer(() => {

  return <Grid container spacing={2}>
    <Grid item>
      <Graph1 />
    </Grid>
    <Grid item>
      <Graph2 />
    </Grid>
  </Grid>
})

const Graph1 = observer(() => {
  return <CytoscapeComponent
    style={{ width: '600px', height: '600px', backgroundColor: 'grey' }}
    elements={graph_store.get_cytoscape_elements()}
    layout={{
      name: 'cose'
    }}
    stylesheet={[{
      selector: 'node',
      style: {
        label: 'data(name)',
        backgroundColor: '#666',
        'text-wrap': 'wrap', //@ts-ignore
        "text-max-wdth": '100000px',
        'text-halign': 'center',
        'text-valign': 'center'
      }
    }, {
      selector: 'node[_table_name = "values"]',
      style: {
        shape: 'rectangle'
      }
    }, {
      selector: 'node[_table_name = "goals"]',
      style: {
        shape: 'ellipse'
      }
    },
    {
      selector: 'node[_table_name = "behaviours"]',
      style: {
        shape: 'ellipse',
        'border-style': 'dashed',
        'border-width': 2,
        'border-color': '#666',
        'background-opacity': 0
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 3,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier'
      }
    }]}
  />
})

const Graph2 = observer(() => {
  return <CytoscapeComponent
    style={{ width: '600px', height: '600px', backgroundColor: 'grey' }}
    elements={graph_store.get_cytoscape_elements()}
    layout={{
      name: 'dagre',
      nodeDimensionsIncludeLabels: true
    }}
    stylesheet={[{
      selector: 'node',
      style: {
        label: 'data(name)',
        backgroundColor: '#666',
        'text-wrap': 'wrap',
        "text-max-wdth": '100000px',
        'text-halign': 'center',
        'text-valign': 'center'
      }
    }, {
      selector: 'node[_table_name = "values"]',
      style: {
        shape: 'rectangle'
      }
    }, {
      selector: 'node[_table_name = "goals"]',
      style: {
        shape: 'ellipse',
      }
    },
    {
      selector: 'node[_table_name = "behaviours"]',
      style: {
        shape: 'ellipse',
        'border-style': 'dashed',
        'border-width': 2,
        'border-color': '#666',
        'background-opacity': 0,
        height: ele => {
          const behaviour_events_count = ele.data('behaviourEvents')?.length ?? 0
          const t = behaviour_events_count / 3
          console.log('h', t, behaviour_events_count, ele.data('behaviourEvents'))
          //@ts-ignore
          window.ele = ele
          return `${lerp(20, 100, t)}px`
        }, // 3 should be set to the max number of behaviour events
        width: ele => {
          const behaviour_events_count = ele.data('behaviourEvents')?.length ?? 0
          const t = behaviour_events_count / 3
          return `${lerp(20, 100, t)}px`
        }, // 3 should be set to the max number of behaviour events
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 3,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'curve-style': 'bezier',
        'source-arrow-shape': 'none',
        'target-arrow-shape': 'none',
      }
    }]}
  />
})