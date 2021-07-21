import { makeAutoObservable } from 'mobx'
import { router_store } from '../../router_store'
import { server_post } from '../../server_connector'


class ValueStore {
    value: Record<string, any> = {}


    constructor() {
        makeAutoObservable(this)
    }

    get value_id () {
        return router_store.query.value_id
    }

    save_changes = () => {
        const is_update = !!this.value_id
        const prisma_method = is_update ? 'update' : 'create' // delete is done from the values table page
        const prisma_body = {
            data: {
                ...this.value
            }
        }

        server_post(`/prisma/value/${prisma_method}`, prisma_body)
    }

}

export const value_store = (window as any).value_store = new ValueStore()