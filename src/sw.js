const IMAGE_CACHE = `image-cache-v__SERVICE_WORKER_VERSION__`

// Cache images.
self.addEventListener('fetch', event => {
  event.respondWith(
    (async () => {
      try {
        const cache = await caches.open(IMAGE_CACHE)
        const cachedResponse = await cache.match(event.request)

        if (cachedResponse) return cachedResponse

        // Use CORS mode on image requests to avoid opaque responses from a cross-origin (e.g., Contentful).
        const isImageRequest = event.request.headers.get('Accept')?.includes('image')
        const request = isImageRequest ? new Request(event.request.url, { mode: 'cors' }) : event.request
        const networkResponse = await fetch(request)

        if (
          networkResponse?.ok &&
          networkResponse?.headers.get('Content-Type')?.startsWith('image') &&
          !networkResponse?.url.includes('google-analytics') // Don't cache Google Analytics requests.
        ) {
          await cache.put(event.request, networkResponse.clone())
        }

        return networkResponse
      } catch (error) {
        console.error('Failed to handle fetch event:', error)

        return new Response(null, { status: 500 })
      }
    })()
  )
})

// Delete old caches.
self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      try {
        const cacheWhitelist = [IMAGE_CACHE]
        const cacheNames = await caches.keys()
        const cachesToDelete = cacheNames.filter(cacheName => !cacheWhitelist.includes(cacheName))

        await Promise.all(cachesToDelete.map(cacheName => caches.delete(cacheName)))

        self.clients.claim()
      } catch (error) {
        console.error('Failed to activate service worker:', error)
      }
    })()
  )
})
