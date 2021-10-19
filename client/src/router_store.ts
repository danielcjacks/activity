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
export const router_store: RouterStore = makeMobxLocation({ hashHistory: true }) // when you use hash history instead of html5 history APIs
// export const router_store = makeMobxLocation({ arrayFormat: 'bracket' }) // default
// export const router_store = makeMobxLocation({ arrayFormat: 'index' }) // will index array params in the url, refer to https://www.npmjs.com/package/query-string#arrayformat

export const get_url_location_path = (): string[] => {
    const hash = router_store.hash
    const no_hash = hash.replace('#', '') // take off #
    const no_query_params = no_hash.split('?')[0] // take off everything after ?

    const location_path = no_query_params.split('/').filter(el => !!el) // remove empty ones, there will be // since we deleted the #
    return location_path
}



(window as any).router_store = router_store