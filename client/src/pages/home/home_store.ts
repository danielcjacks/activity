import cytoscape from 'cytoscape'
import { sum } from 'lodash'
import { makeAutoObservable, runInAction } from 'mobx'
import { server_post } from '../../server_connector'
import { shared_store } from '../../shared_store'
import { setup_async_loaders } from '../../utils/async_loaders'

class HomeStore {
  behaviours: any[] = []
  behaviour_events: Record<string, any>[] = []

  constructor() {
    setup_async_loaders(this)
    makeAutoObservable(this)
  }

  fetch_behaviours = async () => {
    const behaviours = await server_post('/prisma/behaviour/findMany')
    if (behaviours && !behaviours.error) {
      runInAction(() => (this.behaviours = behaviours))
    }
  }

  fetch_behaviour_events = async () => {
    const behaviour_events = await server_post('/prisma/behaviourEvent/findMany', {
      include: {
        behaviour: {
          include: {
            behaviour_motivators: {
              include: {
                motivator: true
              }
            }
          }
        }
      }
    })
    if (behaviour_events && !behaviour_events.error) {
      const mapped_behaviour_events = behaviour_events.map(behaviour_event => ({
        ...behaviour_event,
        positivity: behaviour_event?.behaviour?.behaviour_motivators?.[0]?.motivator?.positivity ?? 0
      }))
      runInAction(() => (this.behaviour_events = mapped_behaviour_events))
    }
  }

  toggle_behaviour_event = async (behaviour_index: number) => {
    const behaviour = this.behaviours[behaviour_index]
    const is_created = !!behaviour.behaviour_event
    if (is_created) {
      await this.delete_behaviour_event(behaviour.behaviour_event.id)
      delete behaviour.behaviour_event
    } else {
      const behaviour_event = await this.create_behaviour_event(behaviour.id)
      if (behaviour_event) {
        behaviour.behaviour_event = behaviour_event
      }
    }

    await this.fetch_behaviour_events()
  }

  create_behaviour_event = async (behaviour_id: number) => {
    const behaviour_event = {
      behaviour_id,
    }
    const response = await server_post('/prisma/behaviourEvent/create', {
      data: behaviour_event,
    })

    if (response && !response.error) {
      shared_store.show_toast('info', 'Added behaviour event')
      return response
    }
  }

  delete_behaviour_event = async (behaviour_event_id: number) => {
    const response = await server_post('/prisma/behaviourEvent/delete', {
      where: {
        id: behaviour_event_id,
      },
    })

    if (response && !response.error) {
      shared_store.show_toast('info', 'Removed behaviour event')
    }
  }
}

export const home_store = ((window as any).home_store = new HomeStore())
