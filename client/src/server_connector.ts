/**
 * @param server_route a server route like '/login'
 */
export const server_post = async (server_route, body) => {
    try {
        const response = await fetch(`http://localhost:5000${server_route}`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            redirect: 'follow',
            headers: {
                'Content-Type': 'application/json'
            },
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(body)
        })
    
        const json_response = await response.json()
        return json_response
    } catch (error) {
        console.log(error)
        return undefined
    }
}