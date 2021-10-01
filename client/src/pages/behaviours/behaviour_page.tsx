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
  FormControlLabel,
  Checkbox,
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
    <>
      <BehaviourTitle />
      <Box m={2}>
        <BehaviourFields />
        <BehaviourMotivatorsAdder />
        {behaviour_store.is_update() ? <BehavioursRemoved /> : null}
        <SaveButton
          can_save={true}
          is_loading={get_loading(
            behaviour_store,
            behaviour_store.save_changes
          )}
          on_save={() => behaviour_store.save_changes()}
        />
      </Box>
    </>
  )
})

const BehavioursRemoved = observer(() => {
  if (behaviour_store.tombstoned_ids.size === 0) return null

  return (
    <Grid item xs={12} sm="auto">
      <Typography>Motivators Removed</Typography>
      <List>
        {behaviour_store.filter_tombstone().map((motivator_id) => {
          return (
            <ListItem key={motivator_id}>
              <Typography color="error">
                {
                  behaviour_store.available_motivators.find((motivator) => {
                    return motivator.id === +motivator_id
                  }).name
                }
              </Typography>
            </ListItem>
          )
        })}
      </List>
    </Grid>
  )
})

const BehaviourMotivatorsAdder = observer(() => {
  useEffect(() => {
    behaviour_store.on_component_load()
  }, [])
  return (
    <Grid item xs={12} sm="auto">
      <Typography>Motivators</Typography>
      <List>
        {behaviour_store.motivator_ids_added.map((_, motivator_index) => {
          return (
            <ListItem key={motivator_index}>
              <MotivatorSelect motivator_index={motivator_index} />
              <IconButton
                onClick={action(() =>
                  behaviour_store.remove_motivator(motivator_index)
                )}
              >
                <RemoveIcon />
              </IconButton>
            </ListItem>
          )
        })}

        <ListItem>
          <ListItemIcon>
            <IconButton onClick={action(() => behaviour_store.add_motivator())}>
              <AddIcon />
            </IconButton>
          </ListItemIcon>
        </ListItem>
      </List>
    </Grid>
  )
})

interface MotivatorSelectPropTypes {
  motivator_index: number
}

const MotivatorSelect: React.FC<MotivatorSelectPropTypes> = observer(
  ({ motivator_index }) => {
    return (
      <FormControl>
        <InputLabel htmlFor="age-native-simple">
          Motivator {motivator_index + 1}
        </InputLabel>
        <Select
          native
          value={behaviour_store.motivator_ids_added[motivator_index]}
          onChange={action((e: any) =>
            behaviour_store.select_motivator(motivator_index, e.target.value)
          )}
        >
          <option aria-label="None" value="" />
          {behaviour_store.available_motivators.map((motivator) => {
            return (
              <option key={motivator.id} value={motivator.id}>
                {motivator.name}
              </option>
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
      <Grid item xs={12} sm="auto">
        <TextField
          variant="filled"
          label="Name"
          value={behaviour_store.name}
          onChange={action((e: any) => (behaviour_store.name = e.target.value))}
        />
      </Grid>
      <Grid item xs={12} sm="auto">
        <TextField
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
      <Grid item xs={12} sm="auto">
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
  return (
    <>
      <Grid item xs={12} sm="auto">
        <TextField
          label="Reminder time"
          type="time"
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
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
          display: 'flex',
          justifyContent: 'space-between',
          maxWidth: '300px',
          paddingTop: '1em',
          paddingBottom: '1em',
        }}
      >
        {behaviour_store.day_letters.map((day_letter, i) => {
          return (
            <div
              key={day_letter + String(i)}
              style={{
                backgroundColor: behaviour_store.reminder_days[i]
                  ? theme.palette.secondary.main
                  : theme.palette.primary.main,
                width: '2em',
                height: '2em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
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
        title={
          router_store.query.motivator_id
            ? `motivator ${router_store.query.motivator_id}`
            : `New Behaviour`
        }
      />
    </Card>
  )
}
