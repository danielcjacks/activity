import { Card, CardHeader, TextField, Grid, Slider, Typography } from '@material-ui/core'
import { get, set } from 'lodash'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { DeleteButton } from '../../components/delete_button'
import { SaveButton } from '../../components/save_button'
import { router_store } from '../../router_store'
import { get_loading } from '../../utils/async_loaders'
import { value_store } from './value_store'


const get_field_props = (path: (string | number)[]) => {
    return {
        value: get(value_store.value, path) ?? '',
        onChange: action(e => set(value_store.value, path, e.target.value))
    }
}

export const ValuePage = observer(() => {
    return <>
        <ValueTitle />
        <ValueFields />
        <SaveButton
            can_save={true}
            is_loading={get_loading(value_store, value_store.save_changes)}
            on_save={value_store.save_changes}
        />
    </>
})

const ValueTitle = observer(() => {
    return <Card>
        <CardHeader title={router_store.query.value_id ? `Value ${router_store.query.value_id}` : `New value`}
            action={<DeleteButton is_deleted={false} on_delete={() => { }} on_restore={() => { }} />}
        />
    </Card>
})

const ValueFields = observer(() => {
    return <Grid container spacing={1}>
        <Grid item xs={12} sm='auto'>
            <TextField
                {...get_field_props(['name'])}
                variant='filled'
                label='Name'
            />
        </Grid>
        <Grid item xs>
            <TextField
                {...get_field_props(['description'])}
                variant='filled'
                multiline={true}
                label='Description'
                fullWidth
            />
        </Grid>
        <Grid item xs={12}>
            <Typography gutterBottom>
                Importance
            </Typography>
        </Grid>
        <Grid item xs={12}>
            <Slider
                style={{ maxWidth: '500px' }}
                value={value_store.value?.importance ?? 0}
                onChange={action((e, new_value) => value_store.value.importance = new_value)}
                defaultValue={0}
                valueLabelDisplay='auto'
                step={1}
                marks
                min={0}
                max={10}
            />
        </Grid>
    </Grid>
})