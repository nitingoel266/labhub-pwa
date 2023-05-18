import { applicationMessage, connectionAttemptOngoing, pwaInstallPromotion, swInstallStatus, swPendingUpdate } from "./labhub/status";
import { isLocalhost } from "./utils/utils";
import { Config } from "./serviceWorkerRegistration";

// Ref: https://web.dev/customize-install/
// Ref: https://whatwebcando.today/articles/handling-service-worker-updates/

// https://web.dev/service-worker-lifecycle/
// https://web.dev/offline-cookbook/


// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt: any = null;
let installPromptOngoing = false;
let updateActivityOngoing = false;

export function setup() {
  if (!isLocalhost && process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    setupInstallPrompt();
    handleAppInstalled();
    // handleDisplayModeChanged();
  }
}

function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();

    // Stash the event so it can be triggered later.
    deferredPrompt = e;

    // Update UI notify the user they can install the PWA
    showInstallPromotion();

    console.log(`'beforeinstallprompt' event was fired.`);
  });
}

function showInstallPromotion() {
  pwaInstallPromotion.next(true);
}

function hideInstallPromotion() {
  pwaInstallPromotion.next(false);
}

// TODO: installPromotion (usePwaInstallPromotion()) && <button onClick={installClickHandler}>Install PWA</button>
export async function installClickHandler() {
  if (installPromptOngoing) {
    return;
  }
  if (!deferredPrompt) {
    console.warn('Unexpected! installClickHandler() called even when deferredPrompt is not set.');    
    return;
  }
  installPromptOngoing = true;
  connectionAttemptOngoing.next(true);

  // Hide the app provided install promotion
  hideInstallPromotion();

  // Show the install prompt
  deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;

  // We've used the prompt, and can't use it again, throw it away
  deferredPrompt = null;

  // outcome: accepted, dismissed
  console.log(`User response to the install prompt: ${outcome}`);

  installPromptOngoing = false;
  connectionAttemptOngoing.next(false);
}

function handleAppInstalled() {
  window.addEventListener('appinstalled', () => {
    // Hide the app-provided install promotion
    hideInstallPromotion();

    // Clear the deferredPrompt so it can be garbage collected
    deferredPrompt = null;

    console.log('LabHub PWA has been installed and added to Home Screen!');
    applicationMessage.next({ type: 'info', message: 'LabHub PWA has been installed and added to Home Screen!' });
  });
}

/*
export function getPWADisplayMode() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  if (document.referrer.startsWith('android-app://')) {
    return 'twa';
  } else if ((navigator as any).standalone || isStandalone) {
    return 'standalone';
  }
  return 'browser';
}

function handleDisplayModeChanged() {
  window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => {
    let displayMode = 'browser';
    if (evt.matches) {
      displayMode = 'standalone';
    }

    console.log('DISPLAY_MODE_CHANGED', displayMode);
  });
}

@media all and (display-mode: standalone) {
  body {
    background-color: yellow;
  }
}
*/

export const setupConfig: Config = { onSuccess, onUpdate, onComplete };

function onSuccess(registration: ServiceWorkerRegistration) {
  // // *First-time installation of ServiceWorker on a site*
  // // Content is cached for offline use.
  // console.log('New ServiceWorker is installed successfully!');

  // In case multiple tabs were initially opened before ServiceWorker installation,
  // we need to reload all the tabs
  signalForceReload();
}

function onUpdate(registration: ServiceWorkerRegistration) {
  // // *Existing ServiceWorker on a site has been updated*
  // // New content is available and will be used when all tabs for this page are closed.'
  // console.log('ServiceWorker has been updated in background!');

  isUpdatePending();
}

function onComplete(status: 'success' | 'error' | 'offline' | null) {
  swInstallStatus.next(status);

  if (status === 'success') {
    isUpdatePending();
  }
}

function isUpdatePending() {
  navigator.serviceWorker.ready
  .then((registration) => {
    if (registration.waiting) {
      swPendingUpdate.next(true);
    }
  });
}

// TODO: updatePending (useSwPendingUpdate()) && <button onClick={updateServiceWorker}>Update PWA</button>
export function updateServiceWorker() {
  if (updateActivityOngoing) {
    return;
  }
  updateActivityOngoing = true;
  connectionAttemptOngoing.next(true);

  swPendingUpdate.next(false);

  signalSkipWaiting();
}

function signalSkipWaiting() {
  navigator.serviceWorker.ready
  .then((registration) => {
    if (registration.waiting) {
      // NOTE: skipWaiting() configured in ServiceWorker: src/service-worker.ts
      registration.waiting.postMessage({type: 'SKIP_WAITING'});
    }
  });
}

function signalForceReload() {
  navigator.serviceWorker.ready
  .then((registration) => {
    if (registration.active) {
      registration.active.postMessage({type: 'FORCE_RELOAD'});
    }
  });
}
