const CACHE_NAME = 'farbig-cache-int-v0.2.2'
const EXTERNAL_CACHE_NAME = 'farbig-cache-ext-v0.2.2'

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/favicon.svg',
  '/version.json',

  '/src/box/box.js',
  '/src/box/colors.js',
  '/src/box/frost.js',
  '/src/box/index.js',
  '/src/box/stream.js',

  '/src/effects/blue.js',
  '/src/effects/gray.js',
  '/src/effects/index.js',
  '/src/effects/orange.js',
  '/src/effects/purple.js',
  '/src/effects/red.js',
  '/src/effects/white.js',

  '/src/dispatch.js',
  '/src/explode.js',
  '/src/match.js',
  '/src/menu.js',
  '/src/mouse.js',
  '/src/pop.js',
  '/src/random.js',
  '/src/score.js',
  '/src/walls.js',
]

const EXTERNAL_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.18.0/matter.min.js',
  'https://unpkg.com/pure-rand/lib/esm/pure-rand.js',
  'https://esm.sh/v135/comma-number@2.1.0/es2022/comma-number.mjs',

  'https://esm.sh/v135/color@4.2.3/es2022/color.mjs',
  'https://esm.sh/v135/color-string@1.9.1/es2022/color-string.mjs',
  'https://esm.sh/v135/color-convert@2.0.1/es2022/color-convert.mjs'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE)
      }),
      caches.open(EXTERNAL_CACHE_NAME).then((cache) => {
        return cache.addAll(EXTERNAL_ASSETS)
      })
    ])
  )
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  if (EXTERNAL_ASSETS.includes(url.href)) {
    event.respondWith(
      caches.open(EXTERNAL_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          return response || fetch(event.request).then((response) => {
            cache.put(event.request, response.clone())
            return response
          });
        });
      })
    );
  } else {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cached) => {
          const live = fetch(event.request).then((response) => {
            cache.put(event.request, response.clone())
            return response
          })

          return cached || live
        })
      })
    )
  }
})

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME, EXTERNAL_CACHE_NAME]
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        )
      }),
    ])
  )
})

const updateIfNecessary = async () => {
  console.log('Checking for updates ...')

  const url = new URL('/version.json', location.href)

  const cache = await caches.open(CACHE_NAME)
  const cached = await cache.match(url)
  const { version: cachedVersion } = cached ? await cached.json() : {}

  const clients = await self.clients.matchAll()

  if (cached) {
    console.log('Current version ' + cachedVersion)
    clients.forEach(client => {
      client.postMessage({
        type: 'CURRENT_VERSION_RETRIEVED',
        version: cachedVersion,
      })
    })
  }

  const response = await fetch(url)
  const { version } = await response.json()

  if (cachedVersion !== version) {
    console.log('Update required, updating in the background ...')
    await cache.addAll(ASSETS_TO_CACHE)
    console.log('Updated to ' + version)

    clients.forEach(client => {
      client.postMessage({
        type: 'ASSETS_UPDATED',
        version,
      })
    })
  } else {
    console.log('Client is already up to date')
  }
}

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CHECK_FOR_UPDATES') {
    updateIfNecessary()
  }
})
