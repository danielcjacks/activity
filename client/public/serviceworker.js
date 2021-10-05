const cache_name = 'version-1'
const urls_to_cache = ['index.html', 'offline.html']

const self = this

// Is called when first visting page
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cache_name).then((cache) => {
      return cache.addAll(urls_to_cache)
    })
  )
})

self.addEventListener('fetch', (event) => {
  // On every request check if file is in cache
  // If it is, return with the cached file
  // If it isn't, try to fetch it
  // If there is an error (means there is no internet or api is down), show error page
  event.respondWith(
    caches.match(event.request).then((cache_response) => {
      if (!cache_response) {
        return fetch(event.request).catch(() => caches.match('offline.html'))
      }
      return cache_response
    })
  )
})

// If service worker is updated, activate event is called to re-install
// Delete all caches except the cache in the cache_name
self.addEventListener('activate', (event) => {
  const cache_white_list = []
  cache_white_list.push(cache_name)
  event.waitUntil(
    caches.keys().then((cache_names) =>
      Promise.all(
        cache_names.map((cache_name) => {
          if (!cache_white_list.includes(cache_name)) {
            return caches.delete(cache_name)
          }
        })
      )
    )
  )
})

// Display push notifications
self.addEventListener('push', (event) => {
  // Display the message sent from the server in the notification
  self.registration.showNotification(event.data.text())
})
