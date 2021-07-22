import { Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { observer } from 'mobx-react-lite'
import { Router } from './router'
import { shared_store } from './shared_store'

const Toasts = observer(() => {
	return (
		<Snackbar
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'center'
			}}
			open={shared_store.toast_is_open}
			autoHideDuration={shared_store.toast_auto_hide_duration}
			onClose={e => shared_store.set_toast_is_open(false)}
		>
			<Alert
				variant='filled'
				severity={shared_store.toast_severity}
				onClose={e => shared_store.set_toast_is_open(false)}
			>
				{shared_store.toast_content}
			</Alert>
		</Snackbar>
	)
})

export const App = () => {
    return <>
        <Router />
        <Toasts />
    </>
}