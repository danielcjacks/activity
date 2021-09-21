import {
  Card,
  CardHeader,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
} from '@material-ui/core'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { event_store } from './behaviour_event_store'
import { SaveButton } from '../../components/save_button'
import { get_loading } from '../../utils/async_loaders'

export const BehaviourEventPage = () => {
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
        can_save={true}
        is_loading={get_loading(event_store, event_store.save)}
        on_save={() => event_store.save()}
      />
    </>
  )
}

const Fields = observer(() => {
  return (
    <>
      <Grid item xs={12}>
        <Typography>Behaviour</Typography>
      </Grid>
      <Grid item xs={12}>
        <Select
          style={{ width: '50%', margin: '1em', padding: '0.5em' }}
          value={event_store.behaviour_id}
          onChange={event_store.handle_select}
        >
          {event_store.behaviours.map((behaviour) => {
            return (
              <MenuItem key={behaviour.id} value={behaviour.id}>
                {behaviour.name}
              </MenuItem>
            )
          })}
        </Select>
      </Grid>
      <Grid item xs={12}>
        <Grid item xs={12} sm="auto">
          <TextField
            value={event_store.comment}
            onChange={action(
              (e: any) => (event_store.comment = e.target.value)
            )}
            variant="filled"
            multiline={true}
            label="Comment"
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <TextField
          value={event_store.get_date_time()}
          onChange={(e: any) => event_store.set_date_time(e.target.value)}
          style={{ color: 'white' }}
          type="datetime-local"
        />
      </Grid>
    </>
  )
})
