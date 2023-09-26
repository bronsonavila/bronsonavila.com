const IMAGE_CACHE = `image-cache-v__SERVICE_WORKER_VERSION__`

// Cache images.
self.addEventListener('fetch', event => {
  const isExternalRequest = !event.request.url.startsWith(self.location.origin)
  const isImageRequest = event.request.headers.get('Accept')?.startsWith('image')

  if (!isImageRequest) return

  event.respondWith(
    (async () => {
      try {
        const cache = await caches.open(IMAGE_CACHE)
        const cachedResponse = await cache.match(event.request)

        if (cachedResponse) return cachedResponse

        const request = isExternalRequest ? new Request(event.request.url, { mode: 'cors' }) : event.request
        const networkResponse = await fetch(request)
        const isGoogleAnalytics = networkResponse?.url.includes('google-analytics')
        const isImageResponse = networkResponse?.headers.get('Content-Type')?.startsWith('image')

        if (networkResponse?.ok && isImageResponse && !isGoogleAnalytics) {
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
