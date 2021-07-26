import { shared_store } from './shared_store'

/**
 * @param server_route a server route like '/login'
 */
export const server_post = async (server_route, body) => {
  const jwt = shared_store.is_auth() ? shared_store.state.token : ''

  try {
    const response = await fetch(`http://localhost:5000${server_route}`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(body),
    })

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
