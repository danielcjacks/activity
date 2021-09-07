import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  CardHeader,
  Dialog,
  DialogTitle,
  IconButton,
  Typography,
  Button,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import CloseIcon from '@material-ui/icons/Close'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { behaviours_store } from './behaviours_store'

export const BehavioursPage = () => {
  useEffect(() => {behaviours_store.component_load()

  }, []); 
  return <>
  <Card style = {{ display: 'flex', justifyContent: 'space-between' }}>
    <CardHeader title={'Behaviours Page'} />
    <IconButton
          style={{
            marginRight: '0.5em',
          }}
          onClick={() => {
            window.location.hash = '#/behaviours/create'
          }}
        >
          <AddIcon />
        </IconButton>
  </Card>
  <BehavioursTable/>
  </>
}
const BehavioursTable = observer(() => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {['Name', 'Description', 'Actions'].map((col_name) => {
            return (
              <TableCell style={{ maxWidth: '25%' }}>
                <Typography variant="caption">{col_name}</Typography>
              </TableCell>
            )
          })}
        </TableRow>
      </TableHead>
      
      <TableBody>
       {behaviours_store.behaviours.map((behaviour) => {
          console.log(behaviour)
          return (
            <TableRow key={behaviour.id}>
              <TableCell style={{ maxWidth: '25%' }}>
                <Typography variant="caption">{behaviour.name}</Typography>
              </TableCell>

              <TableCell style={{ maxWidth: '25%' }}>
                <IconButton
                  onClick={() => {
                    behaviours_store.select_behaviour_for_description(behaviour.id)
                  }}
                >
                  <MoreHorizIcon />
                </IconButton>
              </TableCell>

              {/* <TableCell style={{ maxWidth: '25%' }}>
                {behaviour.positivity}
              </TableCell> */}

              <TableCell style={{ maxWidth: '25%', paddingLeft: '0' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                  }}
                >
                  <IconButton
                    onClick={() => {
                      // This route is not implemented yet
                      window.location.hash = `#/events/create?behaviour_id=${behaviour.id}`
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      // This route is not implemented yet
                      window.location.hash = `#/behaviour/update?behaviour_id=${behaviour.id}`
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      behaviours_store.select_behaviour_for_delete(behaviour.id)
                    }}
                  >
                    <CloseIcon color="error" />
                  </IconButton>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table> 
  )
})
