import { makeAutoObservable } from 'mobx'
import { router_store } from '../../router_store'
import { server_post } from '../../server_connector'
import { shared_store } from '../../shared_store'
import { setup_async_loaders } from '../../utils/async_loaders'

class GoalStore {
  name: string = ''
  description: string = ''
  value_ids_added: string[] = []
  available_values: any[] = []

  constructor() {
    setup_async_loaders(this)
    makeAutoObservable(this)
  }

  get_user_values = async () => {
    const prisma_method = 'findMany'
    const values = await server_post(`/prisma/value/${prisma_method}`, {
      where: { userId: shared_store.state.userId },
    })

    this.available_values = values
  }

  get_values_added_without_duplicates = () => {
    const non_duplicates: string[] = []
    this.value_ids_added.forEach((value_id) => {
      if (!non_duplicates.includes(value_id) && value_id !== '') {
        non_duplicates.push(value_id)
      }
    })
    return non_duplicates
  }

  save_changes = () => {
    const is_update = !!router_store.query.goal_id
    const prisma_method = is_update ? 'update' : 'create' // delete is done from the values table page

    const prisma_body = {
      data: {
        name: this.name,
        description: this.description,
        values: {
          create: this.get_values_added_without_duplicates().map((value_id) => {
            return {
              value: {
                connect: {
                  id: +value_id,
                },
              },
            }
          }),
        },
        userId: shared_store.state.userId,
      },
    }

    return server_post(`/prisma/goal/${prisma_method}`, prisma_body)
      .then((response) => {
        window.location.hash = '#/home'
        shared_store.show_toast('success', 'Goal Added')
      })
      .catch((e) => {
        shared_store.show_toast('error', 'Something went wrong')
      })
  }
}

export const goal_store = ((window as any).goal_store = new GoalStore())
