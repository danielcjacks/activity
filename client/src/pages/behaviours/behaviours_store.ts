import { makeAutoObservable, runInAction } from 'mobx'
import { server_post } from '../../server_connector'
import { shared_store } from '../../shared_store'

class BehavioursStore {
  behaviours: any[] = []
  delete_modal_open = false
  description_modal_open = false
  selected_behaviour_id = ''

  constructor() {
    makeAutoObservable(this)
  }

  component_load = () => {
    this.behaviours = []
    this.description_modal_open = false
    this.delete_modal_open = false
    this.selected_behaviour_id = ''

    server_post(`/prisma/behaviour/findMany`, {
      where: { user_id: shared_store.state.user_id },
    })
      .then((response) => {
        this.behaviours = response.sort((a, b) => {
          if (a.name < b.name) return -1
          if (a.name > b.name) return 1
          return 0
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  select_behaviour_for_delete = (id) => {
    this.toggle_delete_modal()
    this.selected_behaviour_id = id
  }

  select_behaviour_for_description = (id) => {
    this.toggle_description_modal()
    this.selected_behaviour_id = id
  }

  delete_behaviour = () => {
    if (this.selected_behaviour_id === '') {
      this.toggle_delete_modal()
      return
    }
    server_post('/prisma/behaviour/delete', {
      where: { id: +this.selected_behaviour_id },
    })
      .then((response) => {
        if (response.error) {
          shared_store.show_toast('error', response.error.message)
          return
        }
        shared_store.show_toast('success', 'Behaviour deleted')
        this.component_load()
      })
      .catch((e) => {
        shared_store.show_toast('error', 'Something went wrong')
      })
  }

  get_behaviour_name = () => {
    const behaviour = this.behaviours.find(
      (behaviour) => behaviour.id === this.selected_behaviour_id
    )

    if (!behaviour) return ''
    return behaviour.name
  }

  get_behaviour_description = () => {
    const behaviour = this.behaviours.find(
      (behaviour) => behaviour.id === this.selected_behaviour_id
    )

    if (!behaviour) return ''
    return behaviour.description
  }

  toggle_delete_modal = () => {
    this.delete_modal_open = !this.delete_modal_open
  }

  toggle_description_modal = () => {
    this.description_modal_open = !this.description_modal_open
  }
}

export const behaviours_store = ((window as any).behaviours_store =
  new BehavioursStore())
