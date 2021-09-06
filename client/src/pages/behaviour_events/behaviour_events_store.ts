import { makeAutoObservable, toJS } from 'mobx'
import { server_post } from '../../server_connector'
import { shared_store } from '../../shared_store'

class EventsStore {
  events: any[] = []
  comment_modal_open: boolean = false
  delete_modal_open: boolean = false
  selected_event_id: any = ''

  constructor() {
    makeAutoObservable(this)
  }

  reset_state = () => {
    this.events = []
    this.comment_modal_open = false
    this.delete_modal_open = false
    this.selected_event_id = ''
  }

  toggle_delete_modal = () => {
    this.delete_modal_open = !this.delete_modal_open
  }

  toggle_comment_modal = () => {
    this.comment_modal_open = !this.comment_modal_open
  }

  get_selected_event_behaviour = () => {
    const event = this.events.find(
      (event) => event.id === this.selected_event_id
    )
    return !event ? 'Error' : event.behaviour.name
  }

  get_selected_event_comment = () => {
    const event = this.events.find(
      (event) => event.id === this.selected_event_id
    )
    return !event || !event.comment
      ? 'This event log contains no comment'
      : event.comment
  }

  timestamp_to_date = (timestamp) => {
    const date = new Date(timestamp)
    return `${date.getDate()}/${date.getMonth()}/${String(
      date.getFullYear()
    ).slice(2)}`
  }

  timestamp_to_time = (timestamp) => {
    const date = new Date(timestamp)
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  select_event_for_delete = (id) => {
    this.selected_event_id = id
    this.delete_modal_open = true
    this.comment_modal_open = false
  }

  select_event_for_comment = (id) => {
    this.selected_event_id = id
    this.comment_modal_open = true
    this.delete_modal_open = false
  }

  on_component_load = () => {
    this.reset_state()
    server_post('/prisma/behaviourEvent/findMany', {
      where: { user_id: shared_store.state.user_id },
      include: { behaviour: true },
    })
      .then((response) => {
        this.events = response
        // Sort from most recent to least
        this.events.sort(
          (a, b) =>
            new Date(b.time_stamp).getTime() - new Date(a.time_stamp).getTime()
        )
      })
      .catch((error) => {
        console.log(error)
      })
  }

  delete_event = () => {
    if (!this.selected_event_id) {
      this.delete_modal_open = false
      return
    }

    server_post('/prisma/behaviourEvent/delete', {
      where: { id: +this.selected_event_id },
    })
      .then((response) => {
        if (response.error) {
          shared_store.show_toast('error', response.error.message)
          return
        }
        shared_store.show_toast('success', 'Event deleted')
        this.on_component_load()
      })
      .catch((e) => {
        shared_store.show_toast('error', 'Something went wrong')
      })
  }
}

export const events_store = ((window as any).events_store = new EventsStore())
