import {
  Card,
  CardHeader,
  Typography,
  Grid,
  TextField,
  List,
  ListItem,
  FormControl,
  ListItemIcon,
  Box,
  InputLabel,
  Select,
  IconButton,
  MenuItem,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { router_store } from '../../router_store'
import { event_store } from './behaviour_event_store'
import { SaveButton } from '../../components/save_button'
import { get_loading } from '../../utils/async_loaders'
import { behaviour_store } from '../behaviours/behaviour_store'

export const BehaviourEventPage = () => {
  useEffect(() => {
    event_store.on_component_load()
  }, [])
  return (
    <>
      <Card>
        <CardHeader title={`Behaviour Event`} />
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
            return <MenuItem value={behaviour.id}>{behaviour.name}</MenuItem>
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
    </>
  )
})
