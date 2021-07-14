import { isEqual } from 'lodash'
import { observer } from 'mobx-react-lite'
import { HomePage } from './pages/home/home_page'
import { LoginPage } from './pages/login/login_page'
import { getUrlLocationPath } from './router_store'


export const Router = observer(() => {

    const path = getUrlLocationPath()

    return isEqual(path, ['home']) ? <HomePage />
        : isEqual(path, ['login']) ? < LoginPage />
        : <> Page {path.join('/')} Not found </>
})

