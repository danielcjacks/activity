import { makeAutoObservable } from 'mobx'
import { server_post } from '../../server_connector'
import { shared_store } from '../../shared_store'

class LoginStore {
  username: string = ''
  password: string = ''
  error_message: string = ''
  loading: boolean = false

  constructor() {
    makeAutoObservable(this)
  }

  is_error = () => {
    return this.error_message !== ''
  }

  // Handles the json response object of both login and signup
  handle_response = (
    response: Record<string, any>,
    success_message: string
  ): void => {
    // If there is an error, set the error message, and break out of the function
    if (response.error) return (this.error_message = response.message)

    // If success, set token and userId, redirect to home, and popup toast
    shared_store.state.token = response.token
    shared_store.state.userId = response.userId
    window.location.hash = '#/home'
    shared_store.show_toast('success', success_message)
  }

  auth_request = async (path, success_message) => {
    this.loading = true

    const response = await server_post(`${path}`, {
      username: this.username,
      password: this.password,
    })

    this.loading = false

    // If there is an error, set the error message, and break out of the function
    if (response.error) return (this.error_message = response.message)

    // If success, set token and userId, redirect to home, and popup toast
    shared_store.state.token = response.token
    shared_store.state.userId = response.userId
    window.location.hash = '#/home'
    shared_store.show_toast('success', success_message)
  }

  login = () => {
    this.auth_request('/login', 'Login Successful')
  }

  signup = () => {
    this.auth_request('/signup', 'Signup Successful')
  }
}

export const login_store = ((window as any).value_store = new LoginStore())
