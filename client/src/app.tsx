import { Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { observer } from 'mobx-react-lite'
import { Router } from './router'
import { shared_store } from './shared_store'
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FolderIcon from '@material-ui/icons/Folder';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { router_store } from './router_store'

const useStyles = makeStyles({
	root: {
	  position: 'fixed',
	  width: '100%',
	  bottom: '0px',
	},
  });

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

export const App = observer(() => {
    const classes = useStyles();

  	const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
		window.location.hash = newValue;
  	};
	
	return <>
    	<Router />
		<BottomNavigation value={router_store.hash} onChange={handleChange} className={classes.root} showLabels={true}>
      		<BottomNavigationAction label="Home" value="#/home" icon={<RestoreIcon />} />
      		<BottomNavigationAction label="Values" value="#/values" icon={<FavoriteIcon />} />
      		<BottomNavigationAction label="Nearby" value="nearby" icon={<LocationOnIcon />} />
      		<BottomNavigationAction label="Folder" value="folder" icon={<FolderIcon />} />
    	</BottomNavigation>
        <Toasts />
    </>
})