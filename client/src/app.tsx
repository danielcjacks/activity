import { Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { observer } from 'mobx-react-lite'
import { Router } from './router'
import { shared_store } from './shared_store'
import React from 'react'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import AssessmentIcon from '@material-ui/icons/Assessment'
import HomeIcon from '@material-ui/icons/Home'
import FavoriteIcon from '@material-ui/icons/Favorite'
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun'
import { router_store } from './router_store'


const Toasts = observer(() => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={shared_store.toast_is_open}
      autoHideDuration={shared_store.toast_auto_hide_duration}
      onClose={(e) => shared_store.set_toast_is_open(false)}
    >
      <Alert
        variant="filled"
        severity={shared_store.toast_severity}
        onClose={(e) => shared_store.set_toast_is_open(false)}
      >
        {shared_store.toast_content}
      </Alert>
    </Snackbar>
  )
})

interface NavBarProps {
  hidden: boolean
}

const NavBar = observer(({ hidden }: NavBarProps) => {
  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    window.location.hash = newValue
  }

  return (
    <BottomNavigation
      value={router_store.hash}
      onChange={handleChange}
      style={
        hidden
          ? { visibility: 'hidden' }
          : { position: 'fixed', width: '100%', bottom: '0px' }
      }
      showLabels={false}
    >
      <BottomNavigationAction label="Home" value="#/home" icon={<HomeIcon />} />
      <BottomNavigationAction
        label="Motivators"
        value="#/motivators"
        icon={<FavoriteIcon />}
      />
      <BottomNavigationAction
        label="Behaviours"
        value="#/behaviours"
        icon={<DirectionsRunIcon />}
      />
      <BottomNavigationAction
        label="Visualise"
        value="#/graph"
        icon={<AssessmentIcon />}
      />
    </BottomNavigation>
  )
})

export const App = observer(() => {
  return (
    <>
      <Router />
			{/* we need a hidden copy so the bottom of the page doesnt get cut off by the floating nav bar */}
      <NavBar hidden={true} />
      <NavBar hidden={false} />
      <Toasts />
    </>
  )
})
