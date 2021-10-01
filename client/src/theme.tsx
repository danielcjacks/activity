// override material ui theme properties here.
// Full example: https://material-ui.com/customization/default-theme/
// Explanation: https://material-ui.com/customization/theming/#theming
// default theme as json: https://gist.github.com/phusick/b5a114b9fd4baeca339b12160139635d

import { createTheme } from '@material-ui/core'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#64B5F6',
    },
    secondary: {
      main: '#f50057',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    success: {
      main: '#4caf50',
    },
    type: 'dark',
  },
})
