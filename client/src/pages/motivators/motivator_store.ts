import { makeAutoObservable } from 'mobx'
import { router_store } from '../../router_store'
import { server_post } from '../../server_connector'
import { shared_store } from '../../shared_store'
import { setup_async_loaders } from '../../utils/async_loaders'

class MotivatorStore {
  motivator: Record<string, any> = {}

  constructor() {
    setup_async_loaders(this)
    makeAutoObservable(this)
  }

  get motivator_id() {
    return router_store.query.motivator_id
  }

  save_changes = () => {
    const is_update = !!this.motivator_id
    const prisma_method = is_update ? 'update' : 'create' // delete is done from the values table page

    const prisma_body = {
      data: {
        ...this.motivator,
        user_id: shared_store.state.userId,
      },
    }

    console.log(prisma_body)

    server_post(`/prisma/motivator/${prisma_method}`, prisma_body)
      .then((response) => {
        if (response.error) {
          shared_store.show_toast('error', response.error.message)
          return
        }
        window.location.hash = '#/motivators'
        shared_store.show_toast(
          'success',
          `Motivator ${is_update ? 'updated' : 'saved'}`
        )
      })
      .catch((e) => {
        shared_store.show_toast('error', 'Something went wrong')
      })
  }
}

export const motivator_store = ((window as any).motivator_store =
  new MotivatorStore())
