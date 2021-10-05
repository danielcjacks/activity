import { IconButton, Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { observer } from 'mobx-react-lite'
import { Router } from './router'
import { shared_store } from './shared_store'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import AssessmentIcon from '@material-ui/icons/Assessment'
import HomeIcon from '@material-ui/icons/Home'
import FavoriteIcon from '@material-ui/icons/Favorite'
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun'
import AddAlarmIcon from '@material-ui/icons/AddAlarm'
import { router_store } from './router_store'
import { theme } from './theme'

const useStyles = makeStyles({
  root: {
    position: 'fixed',
    width: '100%',
    bottom: '0px',
  },
})

const Toasts = observer(() => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
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

export const App = observer(() => {
  const current_path = router_store.hash.split('/').slice(0, 2).join('/')

  const routes = [
    {
      label: 'Home',
      link: '#/home',
      icon: (
        <HomeIcon color={'#/home' === current_path ? 'primary' : 'inherit'} />
      ),
    },
    {
      label: 'Motivators',
      link: '#/motivators',
      icon: (
        <FavoriteIcon
          color={'#/motivators' === current_path ? 'primary' : 'inherit'}
        />
      ),
    },
    {
      label: 'Behaviours',
      link: '#/behaviours',
      icon: (
        <DirectionsRunIcon
          color={'#/behaviours' === current_path ? 'primary' : 'inherit'}
        />
      ),
    },
    {
      label: 'Events',
      link: '#/events',
      icon: (
        <AddAlarmIcon
          color={'#/events' === current_path ? 'primary' : 'inherit'}
        />
      ),
    },
    {
      label: 'Visualise',
      link: '#/graph',
      icon: (
        <AssessmentIcon
          color={'#/graph' === current_path ? 'primary' : 'inherit'}
        />
      ),
    },
  ]

  const selected_index = routes.findIndex((route) => {
    return route.link === current_path
  })

  return (
    <>
      <Router />
      <div
        style={{
          position: 'fixed',
          bottom: '0',
          width: '100vw',
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: '#424242',
          zIndex: 100,
        }}
      >
        {routes.map(({ label, link, icon }, i) => {
          return (
            <IconButton
              style={{
                maxWidth: '20vw',
                width: '5em',
                height: '2.5em',
                borderRadius: '0',
              }}
              onClick={() => {
                window.location.hash = link
              }}
            >
              <div>
                <div>{icon}</div>
                {i === selected_index && (
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: theme.palette.primary.main,
                    }}
                  >
                    {label}
                  </div>
                )}
              </div>
            </IconButton>
          )
        })}
      </div>
      <Toasts />
    </>
  )
})
