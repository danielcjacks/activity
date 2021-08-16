import { makeAutoObservable, runInAction } from 'mobx'
import { setup_async_loaders } from '../../utils/async_loaders'
import { router_store } from '../../router_store'
import { server_post } from '../../server_connector'
import { shared_store } from '../../shared_store'

class GoalStore {
  name: string = ''
  description: string = ''
  // List of all available values to add
  available_values: any[] = []
  // List of the ids of values currently added to the goal
  // Empty string represents a value has not been selected
  value_ids_added: string[] = []
  // Values that need to be deleted if in update mode
  tombstoned_ids: Set<number> = new Set()
  // The values that the goal had before (only for updating)
  previous_value_ids: string[] = []

  constructor() {
    // MobX setup
    setup_async_loaders(this)
    makeAutoObservable(this)
  }

  reset_state = () => {
    this.name = ''
    this.description = ''
    this.value_ids_added = []
    this.tombstoned_ids = new Set()
    this.previous_value_ids = []
  }

  is_update = () => {
    const path = router_store.hash.split('/')
    return path[path.length - 1].split('?')[0] === 'update'
  }

  on_component_load = () => {
    this.reset_state()
    // If on update path, load the goal
    if (this.is_update()) {
      // If in update mode, but no goal_id, redirect home
      if (!router_store.query.goal_id) {
        window.location.hash = '#/home'
      }
      this.load_goal()
    }

    // Always load the values
    this.get_user_values()
  }

  load_goal = async () => {
    const goal_id = router_store.query.goal_id

    // If not updating a goal, we do not need to load a goal
    if (!goal_id) return

    // Find goal
    const goal = await server_post('/prisma/goal/findUnique', {
      where: {
        id: +goal_id,
      },
      include: {
        values: true,
      },
    })

    runInAction(() => {
      this.name = goal.name
      this.description = goal.description
      this.value_ids_added = goal.values.map((value) => value.valueId)
    })
  }

  get_user_values = async () => {
    const prisma_method = 'findMany'
    const values = await server_post(`/prisma/value/${prisma_method}`, {
      where: { userId: shared_store.state.userId },
    })

    this.available_values = values
  }

  add_value = () => {
    // Add a value that can be selected
    this.value_ids_added.push('')
  }

  select_value = (value_index, value_id) => {
    const previous_id = this.value_ids_added[value_index]

    // Add value id to tombstone list if not default empty value
    if (previous_id !== '') this.tombstoned_ids.add(+previous_id)

    // Remove new value id from tombstoned
    this.tombstoned_ids.delete(+value_id)

    this.value_ids_added[value_index] = value_id
  }

  remove_value = (value_index) => {
    const value_id = this.value_ids_added[value_index]
    // Add value id to tombstone list if not default empty value
    if (value_id !== '') this.tombstoned_ids.add(+value_id)

    // Remove value from value list
    this.value_ids_added = this.value_ids_added.filter(
      (_, index) => index !== value_index
    )
  }

  filter_values = () => {
    const unique = Array.from(new Set(this.value_ids_added))
    const no_empty = unique.filter((item) => item !== '')
    const no_previous = no_empty.filter(
      (item) => !this.previous_value_ids.includes(item)
    )
    return no_previous
  }

  filter_tombstone = () => {
    const tombstone_array = Array.from(this.tombstoned_ids)
    // Only delete ids that the goal had before (only for updating)
    const only_previous = tombstone_array.filter(
      (item) => !this.previous_value_ids.includes(String(item))
    )
    // Do not have to filter out '', as we never add '' to the set
    return only_previous
  }

  get_value_connectors = () => {
    // This generates a list of connect objects for prisma to connect values to goals,
    // via the joining table
    const value_connectors = this.filter_values().map((value_id) => {
      return {
        value: {
          connect: {
            id: +value_id,
          },
        },
      }
    })
    return value_connectors
  }

  get_value_disconnectors = () => {
    const goal_id = router_store.query.goal_id
    const value_disconnectors = this.filter_tombstone().map((value_id) => {
      return {
        goalId_valueId: {
          goalId: +goal_id,
          valueId: +value_id,
        },
      }
    })
    return value_disconnectors
  }

  get_update_body = () => {
    // This function creates the prisma body for updating the goal object
    // Does not delete tombstoned values, but does add new values
    const goal_id = router_store.query.goal_id

    const body = {
      data: {
        name: this.name,
        description: this.description,
        values: {
          create: this.get_value_connectors(),
          delete: this.get_value_disconnectors(),
        },
      },
      where: {
        id: +goal_id,
      },
    }

    return body
  }

  get_create_body = () => {
    // This function generates the prisma body for creating a goal object
    const body = {
      data: {
        name: this.name,
        description: this.description,
        values: {
          create: this.get_value_connectors(),
        },
        userId: shared_store.state.userId,
      },
    }
    return body
  }

  save_changes = () => {
    // This is called when the save button is pressed
    const goal_id = router_store.query.goal_id
    const is_update = !!goal_id
    const prisma_method = this.is_update() ? 'update' : 'create'

    const prisma_body = is_update
      ? this.get_update_body()
      : this.get_create_body()

    return server_post(`/prisma/goal/${prisma_method}`, prisma_body)
      .then((response) => {
        if (response.error) {
          shared_store.show_toast('error', response.error.message)
          return
        }
        this.reset_state()
        window.location.hash = '#/home'
        shared_store.show_toast(
          'success',
          `Goal ${is_update ? 'updated' : 'saved'}`
        )
      })
      .catch((e) => {
        shared_store.show_toast('error', 'Something went wrong')
      })
  }
}

export const goal_store = ((window as any).goal_store = new GoalStore())
