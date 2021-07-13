import { observer } from 'mobx-react-lite';
import { getUrlLocationPath } from './router_store';


export const Router = observer(() => {

    const path = getUrlLocationPath()

    return <>hi{path}</>
})

