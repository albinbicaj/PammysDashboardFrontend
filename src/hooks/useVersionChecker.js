import { useEffect, useState } from 'react';

const VERSION_CHECK_INTERVAL = 120000; // 2 minutes

export function useVersionChecker() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [latestVersion, setLatestVersion] = useState('');

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const res = await fetch('/version.json', { cache: 'no-store' });
        const data = await res.json();
        const fetchedVersion = data.version;
        const currentVersion = localStorage.getItem('app_version');

        if (currentVersion && currentVersion !== fetchedVersion) {
          setLatestVersion(fetchedVersion);
          setUpdateAvailable(true);
        } else {
          localStorage.setItem('app_version', fetchedVersion);
        }
      } catch (error) {
        console.error('Failed to check app version', error);
      }
    };

    checkVersion();
    const interval = setInterval(checkVersion, VERSION_CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const triggerUpdate = () => {
    if (latestVersion) {
      localStorage.setItem('app_version', latestVersion);
    }
    setUpdateAvailable(false);
    window.location.reload(true); // Reload to fetch new assets
  };

  return { updateAvailable, triggerUpdate };
}
