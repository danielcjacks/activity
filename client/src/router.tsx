import { isEqual } from 'lodash'
import { observer } from 'mobx-react-lite'
import { GoalsPage } from './pages/goals/goals_page'
import { GoalPage } from './pages/goals/goal_page'
import { HomePage } from './pages/home/home_page'
import { LoginPage } from './pages/login/login_page'
import { ValuesPage } from './pages/values/values_page'
import { ValuePage } from './pages/values/value_page'
import { get_url_location_path } from './router_store'
import { shared_store } from './shared_store'

export const Router = observer(() => {

    const path = get_url_location_path()

    // If a client does not have token, redirect to login
    if (!shared_store.is_auth()) window.location.hash = '#/login'

    return (isEqual(path, ['home'])) ? <HomePage />
        : isEqual(path, ['login']) ? < LoginPage />
        : isEqual(path, ['values']) ? < ValuesPage />
        : isEqual(path, ['values', 'create']) ? < ValuePage />
        : isEqual(path, ['goals']) ? < GoalsPage />
        : isEqual(path, ['goals', 'create']) ? <GoalPage />
        : isEqual(path, ['goals', 'update']) ? <GoalPage />
        : <> {window.location.hash = '#/home'} Page {path.join('/')} Not found </>
})

