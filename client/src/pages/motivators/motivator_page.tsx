import {
  Card,
  CardHeader,
  TextField,
  Grid,
  Slider,
  Typography,
} from '@material-ui/core'
import { get, set } from 'lodash'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { DeleteButton } from '../../components/delete_button'
import { SaveButton } from '../../components/save_button'
import { router_store } from '../../router_store'
import { get_loading } from '../../utils/async_loaders'
import { motivator_store } from './motivator_store'

const get_field_props = (path: (string | number)[]) => {
  return {
    value: get(motivator_store.motivator, path) ?? '',
    onChange: action((e) =>
      set(motivator_store.motivator, path, e.target.value)
    ),
  }
}

export const MotivatorPage = observer(() => {
  useEffect(() => {
    motivator_store.on_component_load()
  }, [])
  return (
    <>
      <MotivatorTitle />
      <MotivatorFields />
      <SaveButton
        can_save={motivator_store.form_valid()}
        is_loading={get_loading(motivator_store, motivator_store.save_changes)}
        on_save={motivator_store.save_changes}
      />
    </>
  )
})

const MotivatorTitle = observer(() => {
  return (
    <Card>
      <CardHeader
        style={{ paddingLeft: '2em' }}
        title={
          router_store.query.motivator_id ? `Update Motivator` : `New motivator`
        }
        action={
          <DeleteButton
            is_deleted={false}
            on_delete={() => {}}
            on_restore={() => {}}
          />
        }
      />
    </Card>
  )
})

const MotivatorFields = observer(() => {
  return (
    <Grid style={{ width: '100%' }}>
      <Grid
        style={{
          width: '100%',
          padding: '2em 2em 1em 2em',
        }}
      >
        <TextField
          style={{
            width: '100%',
          }}
          {...get_field_props(['name'])}
          variant="filled"
          label="Name"
        />
      </Grid>
      <Grid style={{ width: '100%', padding: '1em 2em' }}>
        <TextField
          {...get_field_props(['description'])}
          variant="filled"
          multiline={true}
          label="Description"
          fullWidth
        />
      </Grid>
      <Grid style={{ padding: '1em 2em', width: '100%' }}>
        <Typography gutterBottom>Towards / Away</Typography>
        <Slider
          style={{
            maxWidth: '500px',
            margin: 'auto',
            display: 'block',
          }}
          value={motivator_store.motivator?.positivity ?? 0}
          onChange={action(
            (e, new_value) => (motivator_store.motivator.positivity = new_value)
          )}
          defaultValue={0}
          valueLabelDisplay="auto"
          step={1}
          marks
          min={-5}
          max={5}
        />
      </Grid>
      <Grid item xs={12}></Grid>
    </Grid>
  )
})
