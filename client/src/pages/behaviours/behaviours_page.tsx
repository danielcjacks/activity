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
  Box,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import CloseIcon from '@material-ui/icons/Close'
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { behaviours_store } from './behaviours_store'

export const BehavioursPage = () => {
  useEffect(() => {
    behaviours_store.component_load()
  }, [])
  return (
    <>
      <Card style={{ display: 'flex', justifyContent: 'space-between' }}>
        <CardHeader style={{ paddingLeft: '2em' }} title={'Behaviours Page'} />
        <IconButton
          style={{
            marginRight: '0.5em',
            height: 'min-content',
            alignSelf: 'center',
          }}
          onClick={() => {
            window.location.hash = '#/behaviours/create'
          }}
        >
          <AddIcon />
        </IconButton>
      </Card>
      <BehavioursTable />
      <DescriptionModal />
      <DeleteModal />
    </>
  )
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
          return (
            <TableRow key={behaviour.id}>
              <TableCell style={{ maxWidth: '25%' }}>
                <Typography variant="caption">{behaviour.name}</Typography>
              </TableCell>

              <TableCell style={{ maxWidth: '25%' }}>
                <IconButton
                  onClick={() => {
                    behaviours_store.select_behaviour_for_description(
                      behaviour.id
                    )
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
                    <PlaylistAddIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      // This route is not implemented yet
                      window.location.hash = `#/behaviours/update?behaviour_id=${behaviour.id}`
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

const DescriptionModal = observer(() => {
  return (
    <Dialog
      open={behaviours_store.description_modal_open}
      onClose={behaviours_store.toggle_description_modal}
    >
      <DialogTitle>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">Description</Typography>
          <IconButton onClick={behaviours_store.toggle_description_modal}>
            <CloseIcon />
          </IconButton>
        </div>
        {behaviours_store.get_behaviour_description() ? (
          <Typography>
            {behaviours_store.get_behaviour_description()}
          </Typography>
        ) : (
          <Box fontStyle="italic">
            <Typography>This motivator has no comment</Typography>
          </Box>
        )}
      </DialogTitle>
    </Dialog>
  )
})

const DeleteModal = observer(() => {
  return (
    <Dialog
      open={behaviours_store.delete_modal_open}
      onClose={behaviours_store.toggle_delete_modal}
    >
      <DialogTitle>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">Behaviour Delete</Typography>
          <IconButton onClick={behaviours_store.toggle_delete_modal}>
            <CloseIcon />
          </IconButton>
        </div>
        <Typography>
          Are you sure you want to delete this behaviour. It cannot be
          recovered.
        </Typography>

        <div
          style={{
            marginTop: '1em',
            display: 'flex',
            justifyContent: 'space-evenly',
          }}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={behaviours_store.delete_behaviour}
          >
            Confirm
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={behaviours_store.toggle_delete_modal}
          >
            Cancel
          </Button>
        </div>
      </DialogTitle>
    </Dialog>
  )
})
