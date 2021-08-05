import { makeAutoObservable } from 'mobx'
import { router_store } from '../../router_store'
import { server_post } from '../../server_connector'
import { shared_store } from '../../shared_store'
import { setup_async_loaders } from '../../utils/async_loaders'

class GoalStore {
  name: string = ''
  description: string = ''
  value_ids: string[] = []
  available_values: any[] = []

  constructor() {
    setup_async_loaders(this)
    makeAutoObservable(this)

    this.get_user_values()
  }

  get_user_values = async () => {
    const prisma_method = 'findMany'
    const values = await server_post(`/prisma/value/${prisma_method}`, {
      where: { userId: shared_store.state.userId },
    })

    // Set an `added` property to each value, initially to false,
    // and to true if the value reflects the goal being created / updated
    // TODO: Fetch the goal being updated, and autofill (also needs to be done for value updating)
    values.forEach((value) => {
      value.added = false
    })

    this.available_values = values
  }

  save_changes = () => {
    const is_update = !!router_store.query.goal_id
    const prisma_method = is_update ? 'update' : 'create' // delete is done from the values table page

    const prisma_body = {
      data: {
        name: this.name,
        description: this.description,
        values: this.value_ids,
        userId: shared_store.state.userId,
      },
    }

    server_post(`/prisma/goal/${prisma_method}`, prisma_body)
  }
}

export const goal_store = ((window as any).goal_store = new GoalStore())
