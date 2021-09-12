import { observer } from 'mobx-react-lite'
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
import { useEffect } from 'react'
import { events_store } from './behaviour_events_store'

export const BehaviourEventsPage = observer(() => {
  useEffect(() => {
    events_store.on_component_load()
  }, [])
  return (
    <>
      <Card style={{ display: 'flex', justifyContent: 'space-between' }}>
        <CardHeader title={'Behaviour Events'} />
        <IconButton
          style={{
            marginRight: '0.5em',
          }}
          onClick={() => {
            window.location.hash = '#/events/create'
          }}
        >
          <AddIcon />
        </IconButton>
      </Card>
      <EventsTable />
      <DeleteModal />
      <CommentModal />
    </>
  )
})

const EventsTable = observer(() => {
  return (
    <Table>
      {/* <TableHead>
        <TableRow>
          {['Behaviour', 'Comment', 'Time Stamp', 'Actions'].map((col_name) => {
            return (
              <TableCell key={col_name} style={{ maxWidth: '25%' }}>
                <Typography variant="caption">{col_name}</Typography>
              </TableCell>
            )
          })}
        </TableRow>
      </TableHead> */}
      <TableBody>
        {events_store.events.map((event) => {
          return (
            <TableRow key={event.id}>
              <TableCell style={{ maxWidth: '25%' }}>
                <Typography variant="caption">
                  {event.behaviour.name}
                </Typography>
              </TableCell>
              <TableCell style={{ maxWidth: '25%' }}>
                <IconButton
                  onClick={() => {
                    events_store.select_event_for_comment(event.id)
                  }}
                >
                  <MoreHorizIcon />
                </IconButton>
              </TableCell>
              <TableCell style={{ maxWidth: '25%' }}>
                <Typography variant="caption">
                  {events_store.timestamp_to_date(event.time_stamp)}{' '}
                  {events_store.timestamp_to_time(event.time_stamp)}
                </Typography>
              </TableCell>
              <TableCell style={{ maxWidth: '25%' }}>
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
                      window.location.hash = `#/events/update?event_id=${event.id}`
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      events_store.select_event_for_delete(event.id)
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

const CommentModal = observer(() => {
  return (
    <Dialog
      open={events_store.comment_modal_open}
      onClose={events_store.toggle_comment_modal}
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
            {events_store.get_selected_event_behaviour()}
          </Typography>
          <IconButton onClick={events_store.toggle_comment_modal}>
            <CloseIcon />
          </IconButton>
        </div>
        <Typography>{events_store.get_selected_event_comment()}</Typography>
      </DialogTitle>
    </Dialog>
  )
})

const DeleteModal = observer(() => {
  return (
    <Dialog
      open={events_store.delete_modal_open}
      onClose={events_store.toggle_delete_modal}
    >
      <DialogTitle>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">Event Delete</Typography>
          <IconButton onClick={events_store.toggle_delete_modal}>
            <CloseIcon />
          </IconButton>
        </div>
        <Typography>
          Are you sure you want to delete this event. It cannot be recovered.
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
            onClick={events_store.delete_event}
          >
            Confirm
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={events_store.toggle_delete_modal}
          >
            Cancel
          </Button>
        </div>
      </DialogTitle>
    </Dialog>
  )
})
