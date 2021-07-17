import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './app'
import reportWebVitals from './reportWebVitals'
import CssBaseline from '@material-ui/core/CssBaseline'
import { toJS } from 'mobx'
import { ThemeProvider } from '@material-ui/core'
import { theme } from './theme'


ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

(window as any).toJS = toJS