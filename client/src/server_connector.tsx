import { shared_store } from './shared_store'
import config from './config'

/**
 * @param server_route a server route like '/login'
 */
export const server_post = async (server_route, body?) => {
  const jwt = shared_store.is_auth() ? shared_store.state.token : ''

  const server_link =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5000'
      : config.SERVER_ADDRESS

  try {
    const response = await fetch(`${server_link}${server_route}`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      referrerPolicy: 'no-referrer',
      body: body ? JSON.stringify(body) : undefined,
    })

    if (response.status === 401) {
      shared_store.state.token = null
      shared_store.state.userId = null
    }

    const json_response = await response.json()

    if (json_response.error) {
      shared_store.show_toast(
        'error',
        <pre>Error: {json_response.error.message}</pre>
      )
    }
    return json_response
  } catch (error) {
    console.log(error)
    shared_store.show_toast('error', 'Cant connect to server')
    return undefined
  }
}
