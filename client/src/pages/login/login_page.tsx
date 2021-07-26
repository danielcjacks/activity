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

export const LoginPage = observer(() => {
  return (
    <>
      <Card>
        <CardHeader title={'Login'} />
      </Card>
      <Box m={2}>
        <Grid item xs={12} sm="auto">
          <TextField
            value={login_store.username}
            onChange={(e: any) => (login_store.username = e.target.value)}
            variant="filled"
            label={login_store.is_error() ? 'Error' : 'Username'}
            error={login_store.is_error()}
            helperText={login_store.error_message}
          />
        </Grid>
        <Grid item xs>
          <TextField
            type="password"
            value={login_store.password}
            onChange={(e: any) => (login_store.password = e.target.value)}
            variant="filled"
            label="Password"
          />
        </Grid>
        <Grid item xs>
          <Button
            color="primary"
            variant="contained"
            onClick={login_store.login}
            disabled={login_store.loading}
          >
            Login
          </Button>
        </Grid>
        <Grid item xs>
          <Button
            color="secondary"
            variant="contained"
            onClick={login_store.signup}
            disabled={login_store.loading}
          >
            Signup
          </Button>
        </Grid>
      </Box>
    </>
  )
})
