import { Box, Fab, Grid, Tooltip } from '@material-ui/core'
import { Refresh } from '@material-ui/icons'
import cytoscape from 'cytoscape'
import dagre from 'cytoscape-dagre'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import { graph_store } from './graph_store'
import { get_behaviour_size, get_motivator_color } from './graph_functions'

cytoscape.use(dagre)

const reset_layout = () => {
  if (graph_store.cy) {
    graph_store.cy.ready(() => {
      graph_store?.cy
        ?.layout({
          name: 'dagre', // @ts-ignore
          nodeDimensionsIncludeLabels: true, //@ts-ignore
          rankDir: 'LR',
          fit: true,
          // transform: (node, pos) => {
          //   // set positions for axis labels
          //   const node_type = node.data('type')
          //   if (node_type !== 'axis_node') {
          //     return pos
          //   }

          //   const position = node.data('position')
          //   const axis = node.data('axis')

          //   const multipliers = {
          //     bot: 0,
          //     mid: 1,
          //     top: 2,
          //   }

          //   const axis_length = 200

          //   const x = axis === 'x' ? axis_length * multipliers[position] : 0
          //   const y = axis === 'y' ? axis_length * multipliers[position] : 0

          //   return { x, y }
          // },
        })
        ?.run()

      graph_store?.cy?.nodes().forEach((ele) => {
        // set positions for axis labels
        const node_type = ele.data('type')
        if (node_type !== 'axis_node') {
          return
        }

        const position = ele.data('position')
        const axis = ele.data('axis')

        const multipliers = {
          bot: 0,
          mid: 1,
          top: 2,
        }

        const axis_length = 200

        const x = axis === 'x' ? axis_length * multipliers[position] : 0
        const y = axis === 'y' ? axis_length * multipliers[position] : 0

        ele.position({ x, y: y - 20 })
      })
    })
  }
}

export const GraphPage = observer(() => {
  useEffect(() => {
    graph_store.fetch_data().then(() => {
      // it seems like this is an error with the cytoscape-js component, but it does not refresh the layout when new data is loaded
      // (maybe because we are using mobx?). So we rerun the layout manually whenever new data is fetched.
      reset_layout()
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
      <RecenterButton />
    </Grid>
  )
})

const RecenterButton = observer(() => {
  return (
    <Tooltip title={'Reset graph'}>
      <Box position="fixed" bottom={70} right={15}>
        <Fab color="default" style={{}} onClick={() => reset_layout()}>
          <Refresh fontSize="large" />
        </Fab>
      </Box>
    </Tooltip>
  )
})

const get_stylesheet = () => [
  {
    selector: 'node',
    style: {
      color: '#fff',
      'text-background-color': '#303030',
      'text-background-opacity': 0.7
    }
  },
  {
    selector: 'edge',
    style: {
      color: '#fff',
      'line-color': '#7a7a7a'
    }
  },
  {
    selector: 'node[type = "data"]',
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
        return get_motivator_color(ele.data()?.positivity || 0, -5, 5)
      },
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
    selector: 'edge[type = "data"]',
    style: {
      width: 3,
      'target-arrow-color': '#ccc',
      'curve-style': 'bezier',
      'source-arrow-shape': 'none',
      'target-arrow-shape': 'none',
    },
  },
  {
    selector: 'node[type = "axis_node"]',
    style: {
      'background-opacity': 0,
    },
  },
  {
    selector: 'edge[type = "axis_edge"]',
    style: {
      label: 'test label cool',
      width: 3,
      'target-arrow-color': '#ccc',
      'curve-style': 'bezier',
      'source-arrow-shape': 'none',
      'target-arrow-shape': 'triangle',
    },
  },
  {
    selector: 'edge[type = "axis_edge"]',
    style: {
      label: 'test label cool',
      width: 3,
      'target-arrow-color': '#ccc',
      'curve-style': 'bezier',
      'source-arrow-shape': 'none',
      'target-arrow-shape': 'triangle',
    },
  },
  {
    selector: 'edge[type = "axis_edge"][axis = "y"]',
    style: {
      'label': 'data(label)',
      'text-rotation': '270deg',
      'text-margin-x': '-10',
    }
  },
  {
    selector: 'edge[type = "axis_edge"][axis = "x"]',
    style: {
      'label': 'data(label)',
      'text-margin-y': '-10'
    }
  },
]

const Graph2 = observer(() => {
  return (
    <CytoscapeComponent
      cy={(cy) => (graph_store.cy = cy)}
      style={{
        width: '100%',
        position: 'absolute',
        top: '0px',
        bottom: '56px',
        backgroundColor: '#303030',
      }}
      elements={graph_store.get_cytoscape_elements()}
      // @ts-ignore
      stylesheet={get_stylesheet()}
      wheelSensitivity={0.1}
      pan={{ x: 0, y: -20 }}
      zoom={1}
    />
  )
})
