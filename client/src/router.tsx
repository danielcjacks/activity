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

export const Router = observer(() => {

    const path = get_url_location_path()

    // If a client does not have token, redirect to login
    if (!shared_store.is_auth()) window.location.hash = '#/login'

    return (isEqual(path, ['home'])) ? <HomePage />
        : isEqual(path, ['login']) ? < LoginPage />
        : isEqual(path, ['graph']) ? < GraphPage />
        : isEqual(path, ['motivators']) ? < MotivatorsPage />
        : isEqual(path, ['motivators', 'create']) ? < MotivatorPage />
        : isEqual(path, ['motivators', 'update']) ? < MotivatorPage />
        : isEqual(path, ['behaviours']) ? < BehavioursPage />
        : isEqual(path, ['behaviours', 'create']) ? <BehaviourPage />
        : isEqual(path, ['behaviours', 'update']) ? <BehaviourPage />
        : isEqual(path, ['events']) ? <BehaviourEventsPage />
        : isEqual(path, ['events', 'create']) ? <BehaviourEventPage />
        : isEqual(path, ['events', 'update']) ? <BehaviourEventPage />
        : <> {window.location.hash = '#/home'} Page {path.join('/')} Not found </>
})

