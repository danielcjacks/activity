import {
  Card,
  CardHeader,
  Grid,
  Box,
  TextField,
  Button,
} from '@material-ui/core'
import { observer } from 'mobx-react-lite'
import { login_store } from './login_store'
import { get_loading } from '../../utils/async_loaders'

export const LoginPage = () => {
  return (
    <>
      <LoginTitle />
      <Box m={2}>
        <LoginFields />
        <LoginButtons />
      </Box>
    </>
  )
}

const LoginTitle = () => {
  return (
    <Card>
      <CardHeader title={'Login'} />
    </Card>
  )
}

const LoginFields = observer(() => {
  return (
    <>
      <Grid item xs={12} sm="auto">
        <TextField
          value={login_store.username}
          onChange={(e: any) => (login_store.username = e.target.value)}
          variant="filled"
          label="Username"
          helperText={
            login_store.invalid_username_error()
              ? login_store.error_message
              : ''
          }
          error={login_store.invalid_username_error()}
        />
      </Grid>
      <Grid item xs>
        <TextField
          type="password"
          value={login_store.password}
          onChange={(e: any) => (login_store.password = e.target.value)}
          variant="filled"
          label="Password"
          helperText={
            login_store.invalid_password_error()
              ? login_store.error_message
              : ''
          }
          error={login_store.invalid_password_error()}
        />
      </Grid>
    </>
  )
})

const LoginButtons = observer(() => {
  return (
    <>
      <Grid item xs>
        <Button
          color="primary"
          variant="contained"
          onClick={() => login_store.login()}
          disabled={get_loading(login_store, login_store.login)}
        >
          Login
        </Button>
      </Grid>
      <Grid item xs>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => login_store.signup()}
          disabled={get_loading(login_store, login_store.signup)}
        >
          Signup
        </Button>
      </Grid>
    </>
  )
})
