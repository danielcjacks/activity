import { makeAutoObservable, runInAction } from 'mobx'
import { server_post } from '../../server_connector'
import { shared_store } from '../../shared_store'

class MotivatorsStore {
  motivators: any[] = []
  delete_modal_open = false
  description_modal_open = false
  selected_motivator_id = ''

  constructor() {
    makeAutoObservable(this)
  }

  component_load = () => {
    this.motivators = []
    this.description_modal_open = false
    this.delete_modal_open = false
    this.selected_motivator_id = ''

    server_post(`/prisma/motivator/findMany`, {
      where: { user_id: shared_store.state.user_id },
    })
      .then((response) => {
        if (response) {
          this.motivators = response
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  select_motivator_for_delete = (id) => {
    this.toggle_delete_modal()
    this.selected_motivator_id = id
  }

  select_motivator_for_description = (id) => {
    this.toggle_description_modal()
    this.selected_motivator_id = id
  }

  delete_motivator = () => {
    if (this.selected_motivator_id === '') {
      this.toggle_delete_modal()
      return
    }
    server_post('/prisma/motivator/delete', {
      where: { id: +this.selected_motivator_id },
    })
      .then((response) => {
        if (response.error) {
          shared_store.show_toast('error', response.error.message)
          return
        }
        shared_store.show_toast('success', 'Motivator deleted')
        this.component_load()
      })
      .catch((e) => {
        shared_store.show_toast('error', 'Something went wrong')
      })
  }

  get_motivator_name = () => {
    const motivator = this.motivators.find(
      (motivator) => motivator.id === this.selected_motivator_id
    )

    if (!motivator) return ''
    return motivator.name
  }

  get_motivator_description = () => {
    const motivator = this.motivators.find(
      (motivator) => motivator.id === this.selected_motivator_id
    )

    if (!motivator) return ''
    return motivator.description
  }

  toggle_delete_modal = () => {
    this.delete_modal_open = !this.delete_modal_open
  }

  toggle_description_modal = () => {
    this.description_modal_open = !this.description_modal_open
  }
}

export const motivators_store = ((window as any).motivators_store =
  new MotivatorsStore())
