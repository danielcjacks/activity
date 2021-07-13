import makeMobxLocation from 'mobx-location'

interface RouterStore {
    hash: string
    host: string
    hostname: string
    href: string
    origin: string
    pathname: string
    port: string
    protocol: string
    query: Record<string, string>
    search: string
}


// export const router_store = makeMobxLocation({ hashHistory: false }) // default
export const routerStore: RouterStore = makeMobxLocation({ hashHistory: true }) // when you use hash history instead of html5 history APIs
// export const router_store = makeMobxLocation({ arrayFormat: 'bracket' }) // default
// export const router_store = makeMobxLocation({ arrayFormat: 'index' }) // will index array params in the url, refer to https://www.npmjs.com/package/query-string#arrayformat

export const getUrlLocationPath = (): string[] => {
    const matchResults = routerStore.hash.match(/(?:^|#*\/*)(.*?)(?:\?|$)/) // gives just the path part of the has, not the #/ or the query params
    if (!matchResults) {
        return []
    }

    const locationPath = matchResults[1].split('/')
    return locationPath
}



(window as any).routerStore = routerStore