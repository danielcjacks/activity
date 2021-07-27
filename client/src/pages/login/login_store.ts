import { makeAutoObservable, runInAction } from 'mobx'
import { server_post } from '../../server_connector'
import { shared_store } from '../../shared_store'
import { setup_async_loaders } from '../../utils/async_loaders'

enum AuthError {
  INCORRECT_PASSWORD,
  USERNAME_DOES_NOT_EXIST,
  USERNAME_ALREADY_EXISTS,
}
class LoginStore {
  username: string = ''
  password: string = ''
  error_message: string = ''
  error: AuthError | null = null

  // Couldn't get async loading stuff to work,
  // but keeping track of this loading variable is super simple
  loading: boolean = false

  constructor() {
    setup_async_loaders(this)
    makeAutoObservable(this)
  }

  is_error = () => {
    return this.error_message !== ''
  }

  auth_request = async (path, success_message) => {
    // Makes and handles authentication related requests
    this.loading = true

    const response = await server_post(`${path}`, {
      username: this.username,
      password: this.password,
    })
    runInAction(() => {
      this.loading = false

      // If network error
      if (!response) return

      // If there is an error, set the error message, and break out of the function
      if (response.error) {
        this.error_message = response.error.message
        this.setError(response.error.errorCode)
      } else {
        // If success, set token and userId, redirect to home, and popup toast
        shared_store.state.token = response.token
        shared_store.state.userId = response.userId
        window.location.hash = '#/home'
        shared_store.show_toast('success', success_message)
      }
    })
  }

  setError = (errorCode: number): void => {
    switch (errorCode) {
      case 1:
        this.error = AuthError.USERNAME_DOES_NOT_EXIST
        break
      case 2:
        this.error = AuthError.INCORRECT_PASSWORD
        break
      case 3:
        this.error = AuthError.USERNAME_ALREADY_EXISTS
        break
      default:
        this.error = null
    }
  }

  invalid_username_error = () => {
    return (
      this.error === AuthError.USERNAME_ALREADY_EXISTS ||
      this.error === AuthError.USERNAME_DOES_NOT_EXIST
    )
  }

  invalid_password_error = () => {
    return this.error === AuthError.INCORRECT_PASSWORD
  }

  login = () => {
    return this.auth_request('/login', 'Login Successful')
  }

  signup = () => {
    return this.auth_request('/signup', 'Signup Successful')
  }
}

export const login_store = ((window as any).login_store = new LoginStore())
