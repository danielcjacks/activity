import { makeAutoObservable } from 'mobx'


class ValueStore {
    value: Record<string, any> = {}


    constructor() {
        makeAutoObservable(this)
    }

}


export const value_store = (window as any).value_store = new ValueStore()