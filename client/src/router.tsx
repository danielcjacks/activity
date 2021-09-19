import { isEqual } from 'lodash'
import { observer } from 'mobx-react-lite'
import { GraphPage } from './pages/graph/graph_page'
import { BehavioursPage } from './pages/behaviours/behaviours_page'
import { BehaviourPage } from './pages/behaviours/behaviour_page'
import { HomePage } from './pages/home/home_page'
import { LoginPage } from './pages/login/login_page'
import { MotivatorsPage } from './pages/motivators/motivators_page'
import { MotivatorPage } from './pages/motivators/motivator_page'
import { BehaviourEventsPage } from './pages/behaviour_events/behaviour_events_page'
import { BehaviourEventPage } from './pages/behaviour_events/behaviour_event_page'
import { get_url_location_path } from './router_store'
import { shared_store } from './shared_store'
import { useEffect } from 'react'


export const Router = observer(() => {

    const authorised = shared_store.is_auth();

    useEffect(() => {
        // Wait until authorised
        if (!authorised) return;
        (async () => {
            const sw = await navigator.serviceWorker.ready;
            const sub = await sw.pushManager.getSubscription()

            // If there is a subscription, dont ask to subscribe
            if (sub) return;

            const vapidPublicKey = 'BEiHwB66I1_n1XB5N11SUAAW7a8Jk-f2xmzgqWbbZQQypNr__VfpxHjc3pXERrIOiafuFI7UX-dmVvD0MDE_KMU'

            // Prompt user to subscribe
            // Send result of this push to server for notifications
            const push = await sw.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: vapidPublicKey
            })

            
        })()

    }, [authorised])

    const path = get_url_location_path()

    // If a client does not have token, redirect to login
    if (!authorised) window.location.hash = '#/login'

    return (isEqual(path, ['home'])) ? <HomePage />
        : isEqual(path, ['login']) ? < LoginPage />
        : isEqual(path, ['graph']) ? < GraphPage />
        : isEqual(path, ['motivators']) ? < MotivatorsPage />
        : isEqual(path, ['motivators', 'create']) ? < MotivatorPage />
        : isEqual(path, ['behaviours']) ? < BehavioursPage />
        : isEqual(path, ['behaviours', 'create']) ? <BehaviourPage />
        : isEqual(path, ['behaviours', 'update']) ? <BehaviourPage />
        : isEqual(path, ['events']) ? <BehaviourEventsPage />
        : isEqual(path, ['events', 'create']) ? <BehaviourEventPage />
        : isEqual(path, ['events', 'update']) ? <BehaviourEventPage />
        : <> {window.location.hash = '#/home'} Page {path.join('/')} Not found </>
})

