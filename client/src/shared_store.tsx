import { autorun, makeAutoObservable, toJS } from 'mobx'
import { ReactElement } from 'react-transition-group/node_modules/@types/react'
import { router_store } from './router_store'

type ToastSeverity = 'success' | 'error' | 'info' | 'warning'
export class SharedStore {
  state: Record<string, any> = {}

  local_storage_prop = 'activity/shared'

  toast_content: string | ReactElement = ''
  toast_severity: ToastSeverity = 'info'
  toast_auto_hide_duration: number | null = null
  toast_is_open = false

  constructor() {
    makeAutoObservable(this)

    this.load_state()

    autorun(() => {
      toJS(this.state)
      this.save_state()
    })

    autorun(() => {
      const hash = router_store.hash
      if (!hash) {
        window.location.hash = `#${window.location.pathname}`
        window.location.pathname = ''
      }
    })
  }

  save_state = () => {
    localStorage.setItem(this.local_storage_prop, JSON.stringify(this.state))
  }

  is_auth = (): boolean => {
    // If a client has a token, they are authenticated
    // If a request fails due to invalid token,
    // we can remove the token field and this method will return false
    return !!this.state.token
  }

  load_state = () => {
    if (!localStorage.getItem(this.local_storage_prop)) {
      this.save_state()
    }

    const loaded_state = JSON.parse(
      localStorage.getItem(this.local_storage_prop) as string
    ) as Record<string, unknown>

    if (loaded_state) {
      for (const prop in this.state) {
        const has_prop = Object.prototype.hasOwnProperty.call(
          loaded_state,
          prop
        )
        if (has_prop) {
          // @ts-ignore
          this.state[prop] = loaded_state[prop]
        }
      }
    }
  }

  /**
   * Input a string like '/home'
   */
  goto_page = (route: string) => {
    window.location.hash = `#${route}`
  }

  set_toast_is_open = (is_open: boolean) => (this.toast_is_open = is_open)

  show_toast = (
    severity: ToastSeverity,
    message: string | ReactElement,
    auto_hide_duration: number | null = null
  ) => {
    this.toast_content = message
    this.toast_severity = severity
    this.toast_auto_hide_duration = auto_hide_duration
    this.set_toast_is_open(true)
  }
}

export const shared_store = new SharedStore()
;(window as any).shared_store = shared_store
