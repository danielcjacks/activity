import { makeAutoObservable, runInAction } from 'mobx'
import { setup_async_loaders } from '../../utils/async_loaders'
import { router_store } from '../../router_store'
import { server_post } from '../../server_connector'
import { shared_store } from '../../shared_store'

class BehaviourStore {
  name: string = ''
  description: string = ''
  reminder_days: boolean[] = [false, false, false, false, false, false, false]
  day_letters = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  reminder_time: any = '12:00'
  including_reminder: boolean = false

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
    this.reminder_days = [false, false, false, false, false, false, false]
    this.reminder_time = '12:00'
  }

  toggle_day = (day_index) => {
    this.reminder_days[day_index] = !this.reminder_days[day_index]
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

    const schedule = this.parse_schedule_string(behaviour.schedule)

    const motivator_ids = behaviour.behaviour_motivators.map(
      (behaviour_motivator) => behaviour_motivator.motivator_id
    )

    console.log(motivator_ids)

    runInAction(() => {
      this.including_reminder = schedule.reminding
      this.reminder_days = schedule.days
      this.reminder_time = schedule.time
      this.name = behaviour.name
      this.description = behaviour.description
      this.motivator_ids_added = motivator_ids
      this.previous_motivator_ids = [...this.motivator_ids_added]
    })
  }

  get_user_motivators = async () => {
    const prisma_method = 'findMany'
    const motivators = await server_post(`/prisma/motivator/${prisma_method}`, {
      where: { user_id: shared_store.state.userId },
    })

    this.available_motivators = motivators
  }

  create_schedule_string = () => {
    const date = new Date()
    date.setHours(this.reminder_time.slice(0, 2))
    date.setMinutes(this.reminder_time.slice(3, 5))
    const time =
      String(date.getUTCHours()).padStart(2, '0') +
      ':' +
      String(date.getUTCMinutes()).padStart(2, '0')

    return JSON.stringify({
      reminding: this.including_reminder,
      days: this.reminder_days,
      time: time,
    })
  }

  parse_schedule_string = (schedule_string: string) => {
    return JSON.parse(schedule_string.replaceAll('\\', ''))
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
        schedule: this.create_schedule_string(),
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
        schedule: this.create_schedule_string(),
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
