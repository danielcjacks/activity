import { makeAutoObservable } from 'mobx'


class ValuesStore {
    values = []


    constructor() {
        makeAutoObservable(this)
    }
}


export const values_store = (window as any).values_store = new ValuesStore()