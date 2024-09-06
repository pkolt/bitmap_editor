/// <reference lib="webworker" />
import type { RouteMatchCallback } from 'workbox-core';

import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

const cacheResponse = new CacheableResponsePlugin({
  statuses: [0, 200],
});

// Cache First
const cacheName = 'workbox-cache-first';
const matchCallback: RouteMatchCallback = ({ request, url }) => {
  return (
    // HTML pages
    request.destination === 'document' ||
    // CSS
    request.destination === 'style' ||
    // JavaScript
    request.destination === 'script' ||
    // Web Workers
    request.destination === 'worker' ||
    // Fonts
    request.destination === 'font' ||
    // Images
    request.destination === 'image' ||
    // Manifest
    request.destination === 'manifest' ||
    // Text files (for Next.js)
    url.pathname.endsWith('.txt')
  );
};

const strategy = new CacheFirst({
  cacheName,
  matchOptions: {
    ignoreMethod: false,
    ignoreSearch: false,
    ignoreVary: false,
  },
  plugins: [cacheResponse],
});

registerRoute(matchCallback, strategy);

const clearCache = async () => {
  const keys = await caches.keys();
  await Promise.all(keys.map((key) => caches.delete(key)));
};

addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    // Sometimes, it don't update application without timeout.
    clearCache().then(() => setTimeout(() => self.skipWaiting(), 1000));
  }
});
