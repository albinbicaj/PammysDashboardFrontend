/**
 *
 * @param {one of 'localStorage' or 'sessionStorage'} storageType
 * @param {string} key
 * @param {string} value
 */
export const writeToStorage = (key, value, storageType = "localStorage") => {
  // try setting value only if cookies are enabled and that type of storage exists on window object
  if (window.navigator.cookieEnabled && storageType in window) {
    window[storageType].setItem(key, value);
  }
};

/**
 *
 * @param {one of 'localStorage' or 'sessionStorage'} storageType
 * @param {string} key
 */
export const readFromStorage = (key, storageType = "localStorage") => {
  // try getting value only if cookies are enabled
  if (window.navigator.cookieEnabled && storageType in window) {
    return window[storageType].getItem(key);
  }
  return null;
};

/**
 *
 * @param {one of 'localStorage' or 'sessionStorage'} storageType
 * @param {string} key
 */
export const removeFromStorage = (key, storageType = "localStorage") => {
  // try deleting value only if cookies are enabled
  if (window.navigator.cookieEnabled && storageType in window) {
    window[storageType].removeItem(key);
  }
};
