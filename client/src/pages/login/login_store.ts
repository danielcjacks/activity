import { makeAutoObservable } from 'mobx'
import { server_post } from '../../server_connector'
import { shared_store } from '../../shared_store'

class LoginStore {
  username: string = ''
  password: string = ''
  error_message: string = ''
  // Couldn't get async loading stuff to work,
  // but keeping track of this loading variable is super simple
  loading: boolean = false

  constructor() {
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
