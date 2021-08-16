import { makeAutoObservable } from 'mobx'


class MotivatorsStore {
    values = []


    constructor() {
        makeAutoObservable(this)
    }
}


export const motivators_store = (window as any).motivators_store = new MotivatorsStore()