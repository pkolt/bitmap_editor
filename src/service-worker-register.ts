import { Workbox } from 'workbox-window';
import { pwaRequestUpdate, subscribePwaAcceptUpdate } from './components/UpdatePwaDialog/utils';

if ('serviceWorker' in navigator) {
  const wb = new Workbox(`${import.meta.env.BASE_URL}service-worker.js`);

  const showSkipWaitingPrompt = async () => {
    // Assuming the user accepted the update, set up a listener
    // that will reload the page as soon as the previously waiting
    // service worker has taken control.
    wb.addEventListener('controlling', () => {
      // At this point, reloading will ensure that the current
      // tab is loaded under the control of the new service worker.
      // Depending on your web app, you may want to auto-save or
      // persist transient state before triggering the reload.
      window.location.reload();
    });

    // When `event.wasWaitingBeforeRegister` is true, a previously
    // updated service worker is still waiting.
    // You may want to customize the UI prompt accordingly.
    // const updateAccepted = await promptForUpdate();
    pwaRequestUpdate();

    // Wait accept update PWA
    subscribePwaAcceptUpdate(() => wb.messageSkipWaiting());
  };

  // Add an event listener to detect when the registered
  // service worker has installed but is waiting to activate.
  wb.addEventListener('waiting', showSkipWaitingPrompt);

  wb.register();
}
