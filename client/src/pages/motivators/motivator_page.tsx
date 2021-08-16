import { Card, CardHeader, TextField, Grid, Slider, Typography } from '@material-ui/core'
import { get, set } from 'lodash'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { DeleteButton } from '../../components/delete_button'
import { SaveButton } from '../../components/save_button'
import { router_store } from '../../router_store'
import { get_loading } from '../../utils/async_loaders'
import { motivator_store } from './motivator_store'


const get_field_props = (path: (string | number)[]) => {
    return {
        value: get(motivator_store.motivator, path) ?? '',
        onChange: action(e => set(motivator_store.motivator, path, e.target.value))
    }
}

export const MotivatorPage = observer(() => {
    return <>
        <MotivatorTitle />
        <MotivatorFields />
        <SaveButton
            can_save={true}
            is_loading={get_loading(motivator_store, motivator_store.save_changes)}
            on_save={motivator_store.save_changes}
        />
    </>
})

const MotivatorTitle = observer(() => {
    return <Card>
        <CardHeader title={router_store.query.motivator_id ? `Motivator ${router_store.query.motivator_id}` : `New motivator`}
            action={<DeleteButton is_deleted={false} on_delete={() => { }} on_restore={() => { }} />}
        />
    </Card>
})

const MotivatorFields = observer(() => {
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
                value={motivator_store.motivator?.importance ?? 0}
                onChange={action((e, new_value) => motivator_store.motivator.importance = new_value)}
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