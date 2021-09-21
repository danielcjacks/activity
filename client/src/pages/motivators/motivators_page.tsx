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
import { motivators_store } from './motivators_store'

export const MotivatorsPage = observer(() => {
  useEffect(() => {
    motivators_store.component_load()
  }, [])
  return (
    <>
      <Card style={{ display: 'flex', justifyContent: 'space-between' }}>
        <CardHeader title={'Motivators'} />
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
    </>
  )
})

const MotivatorsTable = observer(() => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {['Name', 'Description', 'Positivity', 'Actions'].map((col_name) => {
            return (
              <TableCell style={{ maxWidth: '25%' }}>
                <Typography variant="caption">{col_name}</Typography>
              </TableCell>
            )
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {motivators_store.motivators.map((motivator) => {
          return (
            <TableRow key={motivator.id}>
              <TableCell style={{ maxWidth: '25%' }}>
                <Typography variant="caption">{motivator.name}</Typography>
              </TableCell>
              <TableCell style={{ maxWidth: '25%' }}>
                <IconButton
                  onClick={() => {
                    motivators_store.select_motivator_for_description(
                      motivator.id
                    )
                  }}
                >
                  <MoreHorizIcon />
                </IconButton>
              </TableCell>
              <TableCell style={{ maxWidth: '25%' }}>
                {motivator.positivity}
              </TableCell>
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
          <Typography variant="h6">
            {motivators_store.get_motivator_name()} Description
          </Typography>
          <IconButton onClick={motivators_store.toggle_description_modal}>
            <CloseIcon />
          </IconButton>
        </div>
        <Typography>{motivators_store.get_motivator_description()}</Typography>
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
