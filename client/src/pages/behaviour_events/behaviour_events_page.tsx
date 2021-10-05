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
  Box,
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
    <div style={{ marginBottom: '10em' }}>
      <Card style={{ display: 'flex', justifyContent: 'space-between' }}>
        <CardHeader style={{ paddingLeft: '2em' }} title={'Behaviour Events'} />
        <IconButton
          style={{
            marginRight: '0.5em',
            height: 'min-content',
            alignSelf: 'center',
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
    </div>
  )
})

const EventsTable = observer(() => {
  return (
    <Table>
      {/* <TableHead>
        <TableRow>
          {['Behaviour', 'Comment', 'Time', 'Actions'].map((col_name) => {
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
              <TableCell style={{ maxWidth: '15vw' }}>
                <Typography variant="caption">
                  {event.behaviour.name}
                </Typography>
              </TableCell>
              <TableCell style={{ maxWidth: '10vw' }}>
                <IconButton
                  style={{ width: '1em', height: '1em' }}
                  onClick={() => {
                    events_store.select_event_for_comment(event.id)
                  }}
                >
                  <MoreHorizIcon />
                </IconButton>
              </TableCell>
              <TableCell style={{ maxWidth: '14vw' }}>
                <Typography variant="caption" style={{ textAlign: 'center' }}>
                  {events_store.timestamp_to_date(event.time_stamp)}
                  <br />
                  {events_store.timestamp_to_time(event.time_stamp)}
                </Typography>
              </TableCell>
              <TableCell
                style={{
                  maxWidth: '37vw',
                  paddingLeft: '0',
                  paddingRight: '0',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                  }}
                >
                  <IconButton
                    style={{ width: '1em', height: '1em' }}
                    onClick={() => {
                      // This route is not implemented yet
                      window.location.hash = `#/events/update?event_id=${event.id}`
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    style={{ width: '1em', height: '1em' }}
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
        {!!events_store.get_selected_event_comment() ? (
          <Typography>{events_store.get_selected_event_comment()}</Typography>
        ) : (
          <Box fontStyle="italic">
            <Typography>This event has no comment</Typography>
          </Box>
        )}
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
