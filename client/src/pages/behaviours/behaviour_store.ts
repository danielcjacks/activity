import { makeAutoObservable, runInAction } from 'mobx'
import { setup_async_loaders } from '../../utils/async_loaders'
import { router_store } from '../../router_store'
import { server_post } from '../../server_connector'
import { shared_store } from '../../shared_store'

class BehaviourStore {
  name: string = ''
  description: string = ''
  // List of all available motivators to add
  available_motivators: any[] = []
  // List of the ids of motivators currently added to the behaviour
  // Empty string represents a motivator has not been selected
  motivator_ids_added: string[] = []
  // motivators that need to be deleted if in update mode
  tombstoned_ids: Set<number> = new Set()
  // The motivators that the behaviour had before (only for updating)
  previous_motivator_ids: string[] = []

  constructor() {
    // MobX setup
    setup_async_loaders(this)
    makeAutoObservable(this)
  }

  reset_state = () => {
    this.name = ''
    this.description = ''
    this.motivator_ids_added = []
    this.tombstoned_ids = new Set()
    this.previous_motivator_ids = []
  }

  is_update = () => {
    const path = router_store.hash.split('/')
    return path[path.length - 1].split('?')[0] === 'update'
  }

  on_component_load = () => {
    this.reset_state()
    // If on update path, load the behaviour
    if (this.is_update()) {
      // If in update mode, but no behaviour_id, redirect home
      if (!router_store.query.behaviour_id) {
        window.location.hash = '#/home'
      }
      this.load_behaviour()
    }

    // Always load the motivators
    this.get_user_motivators()
  }

  load_behaviour = async () => {
    const behaviour_id = router_store.query.behaviour_id

    // If not updating a behaviour, we do not need to load a behaviour
    if (!behaviour_id) return

    // Find behaviour
    const behaviour = await server_post('/prisma/behaviour/findUnique', {
      where: {
        id: +behaviour_id,
      },
      include: {
        behaviour_motivators: true,
      },
    })

    runInAction(() => {
      this.name = behaviour.name
      this.description = behaviour.description
      this.motivator_ids_added = behaviour.behaviour_motivators.map(
        (behaviour_motivators) => behaviour_motivators.motivator_id
      )
    })
  }

  get_user_motivators = async () => {
    const prisma_method = 'findMany'
    const motivators = await server_post(`/prisma/motivator/${prisma_method}`, {
      where: { user_id: shared_store.state.userId },
    })

    this.available_motivators = motivators
  }

  add_motivator = () => {
    // Add a motivator that can be selected
    this.motivator_ids_added.push('')
  }

  select_motivator = (motivator_index, motivator_id) => {
    const previous_id = this.motivator_ids_added[motivator_index]

    // Add motivator id to tombstone list if not default empty motivator
    if (previous_id !== '') this.tombstoned_ids.add(+previous_id)

    // Remove new motivator id from tombstoned
    this.tombstoned_ids.delete(+motivator_id)

    this.motivator_ids_added[motivator_index] = motivator_id
  }

  remove_motivator = (motivator_index) => {
    const motivator_id = this.motivator_ids_added[motivator_index]
    // Add motivator id to tombstone list if not default empty motivator
    if (motivator_id !== '') this.tombstoned_ids.add(+motivator_id)

    // Remove motivator from motivator list
    this.motivator_ids_added = this.motivator_ids_added.filter(
      (_, index) => index !== motivator_index
    )
  }

  filter_motivators = () => {
    const unique = Array.from(new Set(this.motivator_ids_added))

    const no_empty = unique.filter((item) => item !== '')
    const no_previous = no_empty.filter(
      (item) => !this.previous_motivator_ids.includes(item)
    )
    return no_previous
  }

  filter_tombstone = () => {
    const tombstone_array = Array.from(this.tombstoned_ids)
    // Only delete ids that the behaviour had before (only for updating)
    const only_previous = tombstone_array.filter(
      (item) => !this.previous_motivator_ids.includes(String(item))
    )
    // Do not have to filter out '', as we never add '' to the set
    return only_previous
  }

  get_motivator_connectors = () => {
    // This generates a list of connect objects for prisma to connect motivators to behaviour,
    // via the joining table

    const motivator_connectors = this.filter_motivators().map(
      (motivator_id) => {
        return {
          motivator: {
            connect: {
              id: +motivator_id,
            },
          },
        }
      }
    )
    return motivator_connectors
  }

  get_motivator_disconnectors = () => {
    const behaviour_id = router_store.query.behaviour_id
    const motivator_disconnectors = this.filter_tombstone().map(
      (motivator_id) => {
        return {
          behaviour_id_motivator_id: {
            behaviour_id: +behaviour_id,
            motivator_id: +motivator_id,
          },
        }
      }
    )
    return motivator_disconnectors
  }

  get_update_body = () => {
    // This function creates the prisma body for updating the behaviour object
    // Does not delete tombstoned motivators, but does add new motivators
    const behaviour_id = router_store.query.behaviour_id

    const body = {
      data: {
        name: this.name,
        description: this.description,
        behaviour_motivators: {
          create: this.get_motivator_connectors(),
          delete: this.get_motivator_disconnectors(),
        },
      },
      where: {
        id: +behaviour_id,
      },
    }

    return body
  }

  get_create_body = () => {
    // This function generates the prisma body for creating a behaviour object
    const body = {
      data: {
        name: this.name,
        description: this.description,
        behaviour_motivators: {
          create: this.get_motivator_connectors(),
        },
        user_id: shared_store.state.userId,
      },
    }
    return body
  }

  save_changes = () => {
    // This is called when the save button is pressed
    const behaviour_id = router_store.query.behaviour_id
    const is_update = !!behaviour_id
    const prisma_method = this.is_update() ? 'update' : 'create'

    const prisma_body = is_update
      ? this.get_update_body()
      : this.get_create_body()

    return server_post(`/prisma/behaviour/${prisma_method}`, prisma_body)
      .then((response) => {
        if (response.error) {
          shared_store.show_toast('error', response.error.message)
          return
        }
        this.reset_state()
        window.location.hash = '#/home'
        shared_store.show_toast(
          'success',
          `Behaviour ${is_update ? 'updated' : 'saved'}`
        )
      })
      .catch((e) => {
        shared_store.show_toast('error', 'Something went wrong')
      })
  }
}

export const behaviour_store = ((window as any).behaviour_store =
  new BehaviourStore())
