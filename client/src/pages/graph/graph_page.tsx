import { observer } from 'mobx-react-lite'
import CytoscapeComponent from 'react-cytoscapejs'
import { graph_store } from './graph_store'


export const GraphPage = observer(() => {

  return <>
    <Graph1 />
  </>
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