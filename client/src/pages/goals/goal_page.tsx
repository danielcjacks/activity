import {
  Card,
  CardHeader,
  Typography,
  Grid,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react-transition-group/node_modules/@types/react'
import { router_store } from '../../router_store'
import { goal_store } from './goal_store'

export const GoalPage = () => {
  return (
    <>
      <GoalTitle />
      <Box m={2}>
        <GoalFields />
        <GoalValuesAdder />
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
        {goal_store.available_values.map((value) => {
          return (
            <ListItem>
              <ListItemText>{value.name}</ListItemText>
              <ListItemIcon>
                {!value.added ? (
                  <AddIcon
                    onClick={action(() => {
                      value.added = true
                    })}
                  />
                ) : (
                  <RemoveIcon
                    onClick={action(() => {
                      value.added = false
                    })}
                  />
                )}
              </ListItemIcon>
            </ListItem>
          )
        })}
      </List>
    </Grid>
  )
})

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
