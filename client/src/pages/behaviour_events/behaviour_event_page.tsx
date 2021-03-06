import {
  Card,
  CardHeader,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@material-ui/core'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect, useRef, useState } from 'react'
import { event_store } from './behaviour_event_store'
import { SaveButton } from '../../components/save_button'
import { get_loading } from '../../utils/async_loaders'

export const BehaviourEventPage = observer(() => {
  useEffect(() => {
    event_store.on_component_load()
  }, [])
  return (
    <>
      <Card>
        <CardHeader style={{ paddingLeft: '2em' }} title={`Behaviour Event`} />
      </Card>
      <Fields />
      <SaveButton
        can_save={event_store.form_valid()}
        is_loading={get_loading(event_store, event_store.save)}
        on_save={() => event_store.save()}
      />
    </>
  )
})

const Fields = observer(() => {
  return (
    <>
      <Grid style={{ padding: '2em 2em 1em 2em', width: '100%' }}>
        <FormControl style={{ width: '100%' }} variant="filled">
          <InputLabel>Behaviour</InputLabel>
          <Select
            value={event_store.behaviour_id}
            onChange={event_store.handle_select}
            label="Behaviour"
          >
            {event_store.behaviours.map((b) => {
              return (
                <MenuItem key={b.id} value={b.id}>
                  {b.name}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
      </Grid>
      <Grid style={{ padding: '1em 2em' }}>
        <TextField
          value={event_store.comment}
          onChange={action((e: any) => (event_store.comment = e.target.value))}
          variant="filled"
          multiline={true}
          label="Comment"
          fullWidth
        />
      </Grid>
      <Grid style={{ padding: '1em 2em' }}>
        <TextField
          label="Time Stamp"
          value={event_store.get_date_time()}
          onChange={(e: any) => event_store.set_date_time(e.target.value)}
          style={{ color: 'white' }}
          type="datetime-local"
        />
      </Grid>
    </>
  )
})
