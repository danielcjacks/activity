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

  reset_state = () => {
    this.motivator = {}
    this.motivator.positivity = 0
  }

  on_component_load() {
    this.reset_state()
    // If on update path, load the motivator
    if (this.is_update()) {
      // If in update mode, but no motivator_id, redirect home
      if (!router_store.query.motivator_id) {
        window.location.hash = '#/home'
      }
      this.load_motivator()
    }
  }

  async load_motivator() {
    const motivator = await server_post('/prisma/motivator/findFirst', {
      where: { id: +router_store.query.motivator_id },
    })

    this.motivator = motivator
  }

  is_update = () => {
    const path = router_store.hash.split('/')
    return path[path.length - 1].split('?')[0] === 'update'
  }

  get motivator_id() {
    return router_store.query.motivator_id
  }

  form_valid() {
    return !!this.motivator.name
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

    if (is_update) {
      prisma_body['where'] = {
        id: this.motivator.id,
      }
    }

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
