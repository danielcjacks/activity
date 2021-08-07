import { observer } from 'mobx-react-lite'
import CytoscapeComponent from 'react-cytoscapejs'
import { graph_store } from './graph_store'


export const GraphPage = observer(() => {

  return <>
    test
    <CytoscapeComponent
      style={{ width: '600px', height: '600px', backgroundColor: 'grey' }}
      elements={graph_store.get_cytoscape_elements()}
      layout={{
        name: 'cose'
      }}
      stylesheet={[{
        selector: 'node',
        style: {
          'background-color': '#666',
          'label': 'data(id)'
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
  </>
})