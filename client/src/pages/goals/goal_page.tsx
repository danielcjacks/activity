import { Card, CardHeader } from '@material-ui/core'
import { router_store } from '../../router_store'
import { DeleteButton } from '../../components/delete_button'

export const GoalPage = () => {
  return (
    <Card>
      <CardHeader
        title={
          router_store.query.value_id
            ? `Value ${router_store.query.value_id}`
            : `New value`
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
}
