// @ts-nocheck
import { Grid } from '@material-ui/core'
import { observer } from 'mobx-react-lite'
import CytoscapeComponent from 'react-cytoscapejs'
import { graph_store } from './graph_store'
import dagre from 'cytoscape-dagre'
import cytoscape from 'cytoscape'
import { invlerp, lerp } from '../../utils/math_utils'
import chroma from 'chroma-js'
import { useEffect } from 'react'

cytoscape.use(dagre)

export const GraphPage = observer(() => {
  useEffect(() => {
    graph_store.fetch_data().then(() => {
      // it seems like this is an error with the cytoscape-js component, but it does not refresh the layout when new data is loaded
      // (maybe because we are using mobx?). So we rerun the layout manually whenever new data is fetched.
      if (graph_store.cy) {
        graph_store.cy.layout({
          name: 'dagre',
          nodeDimensionsIncludeLabels: true,
          rankDir: 'LR'
        }).run()
      }
    })
  }, [])

  return (
    <Grid container spacing={2}>
      {/* <Grid item>
        <Graph1 />
      </Grid> */}
      <Grid item>
        <Graph2 />
      </Grid>
    </Grid>
  )
})

const Graph1 = observer(() => {


  return (
    <CytoscapeComponent
      style={{ width: '600px', height: '600px', backgroundColor: 'grey' }}
      elements={graph_store.get_cytoscape_elements()}
      layout={{
        name: 'cose',
      }}
      stylesheet={get_stylesheet()}
    />
  )
})

const get_stylesheet = () => [
  {
    selector: 'node',
    style: {
      label: 'data(name)',
      backgroundColor: '#666',
      'text-wrap': 'wrap',
      // 'text-max-wdth': '100000px',
      'text-halign': 'center',
      'text-valign': 'center',
    },
  },
  {
    selector: 'node[_table_name = "motivators"]',
    style: {
      shape: 'rectangle',
      backgroundColor: (ele) => {
        console.log(ele, ele.data())
        return get_motivator_color(ele.data()?.positivity || 0, -5, 5)
      }
    },
  },
  {
    selector: 'node[_table_name = "behaviours"]',
    style: {
      shape: 'ellipse',
      'border-style': 'dashed',
      'border-width': 2,
      'border-color': '#666',
      'background-opacity': 0,
      height: (ele) => {
        const behaviour_events_count = ele.data()?.behaviour_events?.length ?? 0
        const max_behaviour_events = graph_store.max_behaviour_events
        const size_multiplier = get_behaviour_size(
          behaviour_events_count,
          max_behaviour_events
        )
        return `${size_multiplier * 150}px`
      },
      width: (ele) => {
        const behaviour_events_count = ele.data()?.behaviour_events?.length ?? 0
        const max_behaviour_events = graph_store.max_behaviour_events
        const size_multiplier = get_behaviour_size(
          behaviour_events_count,
          max_behaviour_events
        )
        return `${size_multiplier * 150}px`
      },
    },
  },
  {
    selector: 'edge',
    style: {
      width: 3,
      'line-color': '#ccc',
      'target-arrow-color': '#ccc',
      'curve-style': 'bezier',
      'source-arrow-shape': 'none',
      'target-arrow-shape': 'none',
    },
  },
]

const Graph2 = observer(() => {
  return (
    <CytoscapeComponent
      cy={cy => graph_store.cy = cy}
      style={{ width: '100%', position: 'absolute', top: '0px', bottom: '56px', backgroundColor: 'grey' }}
      elements={graph_store.get_cytoscape_elements()}
      stylesheet={get_stylesheet()}
      wheelSensitivity={0.1}
    />
  )
})

const get_motivator_color = (
  positivity,
  min_positivity: number,
  max_positivity: number
) => {
  const scale = chroma.bezier(['indianred', '#666', '#477951']).scale()
  const percent = invlerp(min_positivity, max_positivity, positivity)
  const color = scale(percent).hex()
  console.log('color', positivity, percent, color)
  return color
}

/**
 * @returns a value between 0 and 1
 */
const get_behaviour_size = (behaviour_events_count, max_behaviour_events) => {
  // Tanh was chosen since it is a strictly increasing function that increases faster near 0. This means that
  // users can still see the difference between behaviours with smaller numbers of behaviour events, even if some other
  // behaviour has alot more events (kind of like how a logarothmic scale makes it easier to see differences in numbers when
  // there is a lot of variation between them).
  // The *1.313 is just a normalizing constant. Basically it makes the range of the function (0, 1) instaed of (0, 0.762)
  // without changing the overall shape.
  const size = Math.tanh(behaviour_events_count / max_behaviour_events) * 1.313
  return size
}
