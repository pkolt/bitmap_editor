import { PWA_ACCEPT_UPDATE, PWA_REQUEST_UPDATE } from './constants';

export const pwaRequestUpdate = () => {
  window.postMessage({ type: PWA_REQUEST_UPDATE }, location.origin);
};

export const pwaAcceptUpdate = () => {
  window.postMessage({ type: PWA_ACCEPT_UPDATE }, location.origin);
};

export const subscribePwaAcceptUpdate = (callback: () => void) => {
  window.addEventListener('message', (event) => {
    if (event.origin === location.origin && event.data.type === PWA_ACCEPT_UPDATE) {
      callback();
    }
  });
};

export const subscribePwaRequestUpdate = (callback: () => void) => {
  const handler = (event: MessageEvent) => {
    if (event.origin === location.origin && event.data.type === PWA_REQUEST_UPDATE) {
      callback();
    }
  };
  window.addEventListener('message', handler);
  return () => {
    window.removeEventListener('message', handler);
  };
};
