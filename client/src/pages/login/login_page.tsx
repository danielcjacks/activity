import {
  Card,
  CardHeader,
  Grid,
  Box,
  TextField,
  Button,
} from '@material-ui/core'
import { observer } from 'mobx-react-lite'
import { action } from 'mobx'
import { login_store } from './login_store'
import { get_loading } from '../../utils/async_loaders'

export const LoginPage = () => {
  return (
    <>
      <LoginTitle />
      <Box>
        <LoginFields />
        <LoginButtons />
      </Box>
    </>
  )
}

const LoginTitle = () => {
  return (
    <Card>
      <CardHeader style={{ paddingLeft: '2em' }} title={'Login'} />
    </Card>
  )
}

const LoginFields = observer(() => {
  return (
    <>
      <Grid
        style={{
          padding: '2em 2em 1em 2em',
          width: '100%',
        }}
      >
        <TextField
          autoCapitalize="false"
          autoCorrect="false"
          style={{ width: '100%' }}
          value={login_store.username}
          onChange={action((e: any) => (login_store.username = e.target.value))}
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
      <Grid
        style={{
          padding: '1em 2em',
          width: '100%',
        }}
      >
        <TextField
          style={{ width: '100%' }}
          type="password"
          value={login_store.password}
          onChange={action((e: any) => (login_store.password = e.target.value))}
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
      <div
        style={{
          padding: '1em 2em',
          width: '100%',
          display: 'flex',
        }}
      >
        <Button
          style={{ marginRight: '2em', width: '6em' }}
          color="primary"
          variant="contained"
          onClick={() => login_store.login()}
          disabled={get_loading(login_store, login_store.login)}
        >
          Login
        </Button>
        <Button
          style={{ width: '6em' }}
          color="secondary"
          variant="contained"
          onClick={() => login_store.signup()}
          disabled={get_loading(login_store, login_store.signup)}
        >
          Signup
        </Button>
      </div>
    </>
  )
})
