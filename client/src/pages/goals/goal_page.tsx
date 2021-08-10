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
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { router_store } from '../../router_store'
import { goal_store } from './goal_store'
import { SaveButton } from '../../components/save_button'
import { get_loading } from '../../utils/async_loaders'

export const GoalPage = () => {
  return (
    <>
      <GoalTitle />
      <Box m={2}>
        <GoalFields />
        <GoalValuesAdder />
        <SaveButton
          can_save={true}
          is_loading={get_loading(goal_store, goal_store.save_changes)}
          on_save={() => goal_store.save_changes()}
        />
      </Box>
    </>
  )
}

const GoalValuesAdder = observer(() => {
  useEffect(() => {
    goal_store.get_user_values()
  }, [])
  return (
    <Grid item xs={12} sm="auto">
      <Typography>Values</Typography>
      <List>
        {goal_store.value_ids_added.map((_, value_index) => {
          return (
            <ListItem key={value_index}>
              <ValueSelect value_index={value_index} />
              <RemoveIcon
                onClick={action(() => {
                  goal_store.value_ids_added =
                    goal_store.value_ids_added.filter((_, i) => {
                      return i !== value_index
                    })
                })}
              />
            </ListItem>
          )
        })}

        <ListItem>
          <ListItemIcon>
            <AddIcon
              onClick={action(() => {
                goal_store.value_ids_added = [...goal_store.value_ids_added, '']
              })}
            />
          </ListItemIcon>
        </ListItem>
      </List>
    </Grid>
  )
})

interface ValueSelectPropTypes {
  value_index: number
}

const ValueSelect: React.FC<ValueSelectPropTypes> = observer(
  ({ value_index }) => {
    return (
      <FormControl>
        <InputLabel htmlFor="age-native-simple">
          Value {value_index + 1}
        </InputLabel>
        <Select
          native
          value={goal_store.value_ids_added[value_index]}
          onChange={action(
            (e: any) =>
              (goal_store.value_ids_added[value_index] = e.target.value)
          )}
        >
          <option aria-label="None" value="" />
          {goal_store.available_values.map((value) => {
            return (
              <option key={value.id} value={value.id}>
                {value.name}
              </option>
            )
          })}
        </Select>
      </FormControl>
    )
  }
)

const GoalFields = observer(() => {
  return (
    <>
      <Grid item xs={12} sm="auto">
        <TextField
          variant="filled"
          label="Name"
          value={goal_store.name}
          onChange={action((e: any) => (goal_store.name = e.target.value))}
        />
      </Grid>
      <Grid item xs={12} sm="auto">
        <TextField
          value={goal_store.description}
          onChange={action(
            (e: any) => (goal_store.description = e.target.value)
          )}
          variant="filled"
          multiline={true}
          label="Description"
          fullWidth
        />
      </Grid>
    </>
  )
})

const GoalTitle = () => {
  return (
    <Card>
      <CardHeader
        title={
          router_store.query.value_id
            ? `Value ${router_store.query.value_id}`
            : `New Goal`
        }
      />
    </Card>
  )
}
