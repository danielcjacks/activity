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
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { motivators_store } from './motivators_store'
import { motivator_store } from './motivator_store'

export const MotivatorsPage = observer(() => {
  useEffect(() => {
    motivators_store.component_load()
  }, [])
  return (
    <div style={{ marginBottom: '10em' }}>
      <Card style={{ display: 'flex', justifyContent: 'space-between' }}>
        <CardHeader style={{ paddingLeft: '2em' }} title={'Motivators'} />
        <IconButton
          style={{
            marginRight: '0.5em',
            height: 'min-content',
            alignSelf: 'center',
          }}
          onClick={() => {
            window.location.hash = '#/motivators/create'
          }}
        >
          <AddIcon />
        </IconButton>
      </Card>
      <MotivatorsTable />
      <DeleteModal />
      <DescriptionModal />
    </div>
  )
})

const MotivatorsTable = observer(() => {
  return (
    <Table style={{ width: '100vw', overflow: 'auto' }}>
      <TableHead>
        <TableRow>
          {['Name', 'Desc.', 'Rating', 'Actions'].map((col_name) => {
            return (
              <TableCell style={{ maxWidth: '25vw' }}>
                <Typography variant="caption" style={{ textAlign: 'center' }}>
                  {col_name}
                </Typography>
              </TableCell>
            )
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {motivators_store.motivators.map((motivator) => {
          return (
            <TableRow key={motivator.id}>
              <TableCell style={{ maxWidth: '25vw' }}>
                <Typography variant="caption">{motivator.name}</Typography>
              </TableCell>
              <TableCell
                style={{
                  maxWidth: '25vw',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <IconButton
                    style={{ width: '1em', height: '1em' }}
                    onClick={() => {
                      motivators_store.select_motivator_for_description(
                        motivator.id
                      )
                    }}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                </div>
              </TableCell>
              <TableCell style={{ maxWidth: '25vw' }}>
                <div style={{ paddingLeft: '1em' }}>{motivator.positivity}</div>
              </TableCell>
              <TableCell style={{ maxWidth: '25vw', paddingLeft: '0' }}>
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
                      window.location.hash = `#/motivators/update?motivator_id=${motivator.id}`
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      motivators_store.select_motivator_for_delete(motivator.id)
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
      open={motivators_store.description_modal_open}
      onClose={motivators_store.toggle_description_modal}
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
          <IconButton onClick={motivators_store.toggle_description_modal}>
            <CloseIcon />
          </IconButton>
        </div>
        {motivators_store.get_motivator_description() ? (
          <Typography>
            {motivators_store.get_motivator_description()}
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
      open={motivators_store.delete_modal_open}
      onClose={motivators_store.toggle_delete_modal}
    >
      <DialogTitle>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">Motivator Delete</Typography>
          <IconButton onClick={motivators_store.toggle_delete_modal}>
            <CloseIcon />
          </IconButton>
        </div>
        <Typography>
          Are you sure you want to delete this motivator. It cannot be
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
            onClick={motivators_store.delete_motivator}
          >
            Confirm
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={motivators_store.toggle_delete_modal}
          >
            Cancel
          </Button>
        </div>
      </DialogTitle>
    </Dialog>
  )
})
