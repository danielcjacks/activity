import { isEqual } from 'lodash'
import { observer } from 'mobx-react-lite'
import { HomePage } from './pages/home/home_page'
import { LoginPage } from './pages/login/login_page'
import { ValuesPage } from './pages/values/values_page'
import { ValuePage } from './pages/values/value_page'
import { get_url_location_path } from './router_store'


export const Router = observer(() => {

    const path = get_url_location_path()

    return (isEqual(path, ['home']) || isEqual(path, [])) ? <HomePage />
        : isEqual(path, ['login']) ? < LoginPage />
        : isEqual(path, ['values']) ? < ValuesPage />
        : isEqual(path, ['values', 'create']) ? < ValuePage />
        : <> Page {path.join('/')} Not found </>
})

