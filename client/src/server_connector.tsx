import { shared_store } from './shared_store'

/**
 * @param server_route a server route like '/login'
 */
export const server_post = async (server_route, body) => {
  const jwt = shared_store.is_auth() ? shared_store.state.token : ''

  const server_link =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5000'
      : 'https://monash-activity.live'

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
      body: JSON.stringify(body),
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
