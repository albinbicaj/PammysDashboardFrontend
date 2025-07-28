import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

const VERSION_CHECK_INTERVAL = 120000; // 2 minutes

export function useVersionChecker() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [latestVersion, setLatestVersion] = useState('');

  registerSW({
    onNeedRefresh() {
      setUpdateAvailable(true);
    },
    onOfflineReady() {
      console.log('App is ready to work offline');
    },
  });

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const res = await fetch('/version.json', { cache: 'no-store' });
        const { version: fetchedVersion } = await res.json();
        const currentVersion = localStorage.getItem('app_version');

        if (currentVersion && currentVersion !== fetchedVersion) {
          setLatestVersion(fetchedVersion);
          setUpdateAvailable(true);
        } else {
          localStorage.setItem('app_version', fetchedVersion);
        }
      } catch (error) {
        console.error('Failed to check app version:', error);
      }
    };

    checkVersion();
    const interval = setInterval(checkVersion, VERSION_CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const triggerUpdate = async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        console.log('Clearing caches:', cacheNames);
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }
    } catch (err) {
      console.error('Error clearing caches:', err);
    }

    if (latestVersion) {
      localStorage.setItem('app_version', latestVersion);
    }

    window.location.reload();
  };

  return { updateAvailable, triggerUpdate };
}
