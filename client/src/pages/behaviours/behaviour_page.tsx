import {
  Card,
  CardHeader,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  FormControlLabel,
  Checkbox,
  MenuItem,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { router_store } from '../../router_store'
import { behaviour_store } from './behaviour_store'
import { SaveButton } from '../../components/save_button'
import { get_loading } from '../../utils/async_loaders'
import { theme } from '../../theme'

export const BehaviourPage = observer(() => {
  return (
    // Add some space for scrolling
    <div style={{ paddingBottom: '20em' }}>
      <BehaviourTitle />
      <BehaviourFields />
      <BehaviourMotivatorsAdder />
      {behaviour_store.is_update() ? <BehavioursRemoved /> : null}
      <SaveButton
        can_save={behaviour_store.form_valid()}
        is_loading={get_loading(behaviour_store, behaviour_store.save_changes)}
        on_save={() => behaviour_store.save_changes()}
      />
    </div>
  )
})

const BehavioursRemoved = observer(() => {
  if (behaviour_store.tombstoned_ids.size === 0) return null

  return (
    <Grid style={{ padding: '1em 2em' }}>
      <Typography>Motivators Being Removed</Typography>
      {behaviour_store.filter_tombstone().map((motivator_id) => {
        return (
          <div key={motivator_id} style={{ display: 'flex', padding: '0.5em' }}>
            <RemoveIcon color="error" />
            <Typography
              style={{ marginLeft: '0.5em' }}
              color="error"
              key={motivator_id}
            >
              {
                behaviour_store.available_motivators.find((motivator) => {
                  return motivator.id === +motivator_id
                }).name
              }
            </Typography>
          </div>
        )
      })}
    </Grid>
  )
})

const BehaviourMotivatorsAdder = observer(() => {
  useEffect(() => {
    behaviour_store.on_component_load()
  }, [])
  return (
    <Grid
      style={{ padding: '1em 2em', display: 'flex', flexDirection: 'column' }}
    >
      <Typography>Motivators</Typography>
      {behaviour_store.motivator_ids_added.map((_, motivator_index) => {
        return (
          <div
            key={motivator_index}
            style={{
              marginTop: '2em',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <MotivatorSelect motivator_index={motivator_index} />
            <IconButton
              onClick={action(() =>
                behaviour_store.remove_motivator(motivator_index)
              )}
            >
              <RemoveIcon />
            </IconButton>
          </div>
        )
      })}

      <IconButton
        style={{
          marginTop: '0.5em',
          width: '1.5em',
          height: '1.5em',
          display: 'block',
        }}
        onClick={action(() => behaviour_store.add_motivator())}
      >
        <AddIcon />
      </IconButton>
    </Grid>
  )
})

// The types of what the component receives as an argument
interface MotivatorSelectPropTypes {
  motivator_index: number
}

const MotivatorSelect: React.FC<MotivatorSelectPropTypes> = observer(
  ({ motivator_index }) => {
    // Get the id of the motivator the dropdown represents
    const motivator_id = behaviour_store.motivator_ids_added[motivator_index]

    return (
      <FormControl style={{ width: '100%' }} variant="filled">
        <InputLabel>Motivator {motivator_index + 1}</InputLabel>
        {/* The actual dropdown component */}
        {/* When the user changes something, update the id with what was selected */}
        <Select
          style={{ width: '100%', height: '100%' }}
          value={motivator_id}
          onChange={action((e: any) =>
            behaviour_store.select_motivator(motivator_index, e.target.value)
          )}
        >
          {/* Map over the available motivators to chose from, and put them into the dropdown */}
          {behaviour_store.available_motivators.map((motivator) => {
            return (
              <MenuItem key={motivator.id} value={motivator.id}>
                {motivator.name}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
    )
  }
)

const BehaviourFields = observer(() => {
  return (
    <>
      <Grid style={{ width: '100%', padding: '2em 2em 1em 2em' }}>
        <TextField
          style={{ width: '100%' }}
          variant="filled"
          label="Name"
          value={behaviour_store.name}
          onChange={action((e: any) => (behaviour_store.name = e.target.value))}
        />
      </Grid>
      <Grid style={{ width: '100%', padding: '1em 2em' }}>
        <TextField
          style={{ width: '100%' }}
          value={behaviour_store.description}
          onChange={action(
            (e: any) => (behaviour_store.description = e.target.value)
          )}
          variant="filled"
          multiline={true}
          label="Description"
          fullWidth
        />
      </Grid>
      <Grid style={{ width: '100%', padding: '1em 2em' }}>
        <FormControlLabel
          control={
            <Checkbox
              id="reminder-checkbox"
              color="primary"
              value={behaviour_store.including_reminder}
              checked={behaviour_store.including_reminder}
              onChange={action((e: any) => {
                behaviour_store.including_reminder = e.target.checked
              })}
            />
          }
          label="Send reminders"
        />
      </Grid>
      {behaviour_store.including_reminder && <ScheduleTimePicker />}
    </>
  )
})

const ScheduleTimePicker = observer(() => {
  const inputProps = { step: 300 }
  return (
    <>
      <Grid style={{ width: '100%', padding: '1em 2em', paddingTop: '0' }}>
        <TextField
          style={{ color: 'white', width: '10em' }}
          label="Reminder time"
          type="time"
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={inputProps}
          value={behaviour_store.reminder_time}
          onChange={action((e: any) => {
            behaviour_store.reminder_time = e.target.value
          })}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sm="auto"
        style={{
          paddingTop: '1em',
          paddingBottom: '1em',
          padding: '1em 2em',
          display: 'flex',
          justifyContent: 'space-between',
          maxWidth: '400px',
        }}
      >
        {behaviour_store.day_letters.map((day_letter, i) => {
          return (
            <div
              key={day_letter + String(i)}
              style={{
                backgroundColor: behaviour_store.reminder_days[i]
                  ? theme.palette.primary.main
                  : '#676767',
                width: '2em',
                height: '2em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                cursor: 'pointer',
              }}
              onClick={(e: any) => {
                behaviour_store.toggle_day(i)
              }}
            >
              {day_letter}
            </div>
          )
        })}
      </Grid>
    </>
  )
})

const BehaviourTitle = () => {
  return (
    <Card>
      <CardHeader
        style={{ paddingLeft: '2em' }}
        title={
          router_store.query.behaviour_id ? `Update Behaviour` : `New Behaviour`
        }
      />
    </Card>
  )
}
