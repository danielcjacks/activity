import {
  Card,
  CardHeader,
  Grid,
  Box,
  TextField,
  Button,
} from '@material-ui/core'
import { useState } from 'react'
import { server_post } from '../../server_connector'
import { shared_store } from '../../shared_store'

export const LoginPage = () => {
  const [username, set_username] = useState<string>('')
  const [password, set_password] = useState<string>('')
  const [loading, set_loading] = useState(false)
  const [error_message, set_error_message] = useState<string>('')
  const is_error = error_message !== ''

  const on_signup = async () => {
    // Don't send request if loading
    if (loading) return

    set_loading(true)

    const response = await server_post('/signup', {
      username,
      password,
    })

    set_loading(false)

    if (!response.error) {
      // If success, set token and userId, redirect to home, and popup toast
      shared_store.state.token = response.token
      shared_store.state.userId = response.userId
      window.location.hash = '#/home'
      shared_store.show_toast('success', 'Signed up successfully')
    } else {
      // If failuer, popup toast, and set error another error message in field
      set_error_message(response.message)
    }
  }

  const on_login = async () => {
    // Don't send request if loading
    if (loading) return

    set_loading(true)

    const response = await server_post('/login', {
      username,
      password,
    })

    set_loading(false)

    if (!response.error) {
      // If success, set token and userId, redirect to home, and popup toast
      shared_store.state.token = response.token
      shared_store.state.userId = response.userId
      window.location.hash = '#/home'
      shared_store.show_toast('success', 'Logged in successfully')
    } else {
      // If failuer, popup toast, and set error another error message in field
      set_error_message(response.message)
    }
  }

  return (
    <>
      <Card>
        <CardHeader title={'Login'} />
      </Card>
      <Box m={2}>
        <Grid item xs={12} sm="auto">
          <TextField
            value={username}
            onChange={(e: any) => set_username(e.target.value)}
            variant="filled"
            label={is_error ? 'Error' : 'Username'}
            error={is_error}
            helperText={error_message}
          />
        </Grid>
        <Grid item xs>
          <TextField
            type="password"
            value={password}
            onChange={(e: any) => set_password(e.target.value)}
            variant="filled"
            label="Password"
          />
        </Grid>
        <Grid item xs>
          <Button
            color="primary"
            variant="contained"
            onClick={on_login}
            disabled={loading}
          >
            Login
          </Button>
        </Grid>
        <Grid item xs>
          <Button
            color="secondary"
            variant="contained"
            onClick={on_signup}
            disabled={loading}
          >
            Signup
          </Button>
        </Grid>
      </Box>
    </>
  )
}
