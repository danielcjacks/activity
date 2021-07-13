import { autorun, makeAutoObservable, toJS } from 'mobx'
import { routerStore } from './router_store'


export class SharedStore {
    state = {}

    localstorageProp = 'activity/shared'

    toastContent = ''
    toastSeverity = 'info'
    toastAutoHideDuration: number | null = null
    toastIsOpen = false


    constructor() {
        makeAutoObservable(this)

        this.loadState()

        autorun(() => {
            toJS(this.state)
            this.saveState()
        })

        autorun(() => {
            const hash = routerStore.hash
            if (!hash) {
                window.location.hash = `#${window.location.pathname}`
                window.location.pathname = ''
            }
        })
    }

    saveState = () => {
        localStorage.setItem(this.localstorageProp, JSON.stringify(this.state))
    }

    loadState = () => {
        if (!localStorage.getItem(this.localstorageProp)) {
            this.saveState()
        }

        const loaded_state = JSON.parse(localStorage.getItem(this.localstorageProp) as string) as Record<string, unknown>

        if (loaded_state) {
            for (const prop in this.state) {
                const has_prop = Object.prototype.hasOwnProperty.call(loaded_state, prop)
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
    gotoPage = (route: string) => {
        window.location.hash = `#${route}`
    }

    setToastIsOpen = (is_open: boolean) => this.toastIsOpen = is_open

    showToast = (variant: 'success' | 'error' | 'info' | 'warning', message: string, auto_hide_duration: number | null = null) => {
        this.toastContent = message
        this.toastSeverity = variant
        this.toastAutoHideDuration = auto_hide_duration
        this.setToastIsOpen(true)
    }
}

export const sharedStore = new SharedStore();
(window as any).sharedStore = sharedStore;