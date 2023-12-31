// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://cra.link/PWA

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onComplete?: (status: 'success' | 'error' | 'offline' | null) => void;
};

export function register(config?: Config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', async () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config);

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service ' +
              'worker. To learn more, visit https://cra.link/PWA'
          );
        });
      } else {
        // Is not localhost. Just register service worker
        // NOTE: checkValidServiceWorker(swUrl, config); is somewhat slower for it to be used in production

        const p1 = checkValidServiceWorker(swUrl, config, true);
        const p2 = registerValidSW(swUrl, config, true);
        const [status1, status2] = await Promise.all([p1, p2]);
        const status = status1 || status2;
        // Execute callback
        if (config && config.onComplete && status) {
          config.onComplete(status);
        }
      }

      let refreshing = false;
      const originalSW = navigator.serviceWorker.controller;

      // detect controller change and refresh the page
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('3. controllerchange');
        if (originalSW) {
          console.log('4. originalSW');
          // This is due to a SW update.
          if (!refreshing) {
            console.log('5. reloadling..');
            window.location.reload();
            refreshing = true;  
          }
        } else {
          // This is due to a SW taking control for the first time
        }
      });
    });
  } else {
    // Execute callback
    if (config && config.onComplete) {
      config.onComplete(null);
    }    
  }
}

async function registerValidSW(swUrl: string, config?: Config, validate?: boolean) {
  const statusPromise = navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            // NOTE: navigator.serviceWorker.controller === registration.active
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log(
                'New content is available and will be used when all ' +
                  'tabs for this page are closed. See https://cra.link/PWA.'
              );

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log('Content is cached for offline use.');

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
      return 'success' as 'success';
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
      return 'error' as 'error';
    });

    const status = await statusPromise;
    if (!validate) {
      // Execute callback
      if (config && config.onComplete) {
        config.onComplete(status);
      }
    }

    return status;
}

async function checkValidServiceWorker(swUrl: string, config?: Config, validate?: boolean) {
  // Check if the service worker can be found. If it can't reload the page.
  const statusPromise = fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        if (!validate) registerValidSW(swUrl, config);
      }

      return null; // nothing to emit (as of now)
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
      return 'offline' as 'offline';
    });

  const status = await statusPromise;
  if (!validate) {
    // Execute callback
    if (config && config.onComplete && status) {
      config.onComplete(status); // emit 'offline'
    }
  }

  return status;
}

export function unregister(config?: Config) {
  if ('serviceWorker' in navigator) {
    if (!navigator.serviceWorker.controller) {
      // Execute callback
      if (config && config.onComplete) {
        config.onComplete(null);
      }
      return;
    }

    navigator.serviceWorker.ready
      .then((registration) => {
        return registration.unregister();
      })
      .then(status => {
        console.log('serviceWorker unregister status:', status);

        // Execute callback
        if (config && config.onComplete) {
          config.onComplete(null);
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
