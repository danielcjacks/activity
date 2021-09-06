import { makeAutoObservable, runInAction, toJS } from 'mobx'
import { router_store } from '../../router_store'
import { server_post } from '../../server_connector'
import { shared_store } from '../../shared_store'
import { setup_async_loaders } from '../../utils/async_loaders'

class EventStore {
  behaviour_id: number | null = null
  behaviours: any[] = []
  comment: string = ''

  constructor() {
    makeAutoObservable(this)
    setup_async_loaders(this)
  }

  reset_state = () => {
    this.behaviour_id = null
    this.behaviours = []
    this.comment = ''
  }

  is_update = () => {
    const path = router_store.hash.split('/')
    console.log(path)

    return path[path.length - 1].split('?')[0] === 'update'
  }

  // Loads the event when upating
  load_event = async () => {
    const event_id = router_store.query.event_id
    if (!event_id) return

    const event = await server_post('/prisma/behaviourEvent/findUnique', {
      where: {
        id: +event_id,
      },
    })

    runInAction(() => {
      this.comment = event.comment
      this.behaviour_id = event.behaviour_id
    })
  }

  // Runs every time the component is loaded, even re-loads
  on_component_load = () => {
    this.reset_state()
    if (this.is_update()) {
      // If in update mode, but no event_id, redirect home
      if (!router_store.query.event_id) {
        window.location.hash = '#/home'
      }
      this.load_event()
    }
    server_post('/prisma/behaviour/findMany', {
      where: { user_id: shared_store.state.userId },
    })
      .then((response) => {
        this.behaviours = response
        this.behaviours.forEach((behaviour) => {
          behaviour.id = +behaviour.id
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // When a user selects a behaviour
  handle_select = (e: any) => {
    this.behaviour_id = e.target.value
  }

  // When a user clicks save
  save = () => {
    const is_update = this.is_update()
    const event_id = router_store.query.event_id
    const body = is_update
      ? {
          data: {
            comment: this.comment,
            behaviour_id: this.behaviour_id,
          },
          where: { id: +event_id },
        }
      : {
          data: {
            behaviour_id: this.behaviour_id,
            comment: this.comment,
          },
        }

    return server_post(
      `/prisma/behaviourEvent/${is_update ? 'update' : 'create'}`,
      body
    )
      .then((response) => {
        if (response.error) {
          shared_store.show_toast('error', response.error.message)
          return
        }
        this.reset_state()
        window.location.hash = '#/events'
        shared_store.show_toast(
          'success',
          `Event ${is_update ? 'updated' : 'saved'}`
        )
      })
      .catch((e) => {
        shared_store.show_toast('error', 'Something went wrong')
      })
  }
}

export const event_store = ((window as any).event_store = new EventStore())
