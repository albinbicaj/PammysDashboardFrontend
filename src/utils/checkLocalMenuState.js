export const checkLocalMenuState = () => {
  // Check if there is a variable stored in browser local storage
  const localStorageMenu = localStorage.getItem('menu');

  // If there is a variable stored in local storage, return its value
  if (localStorageMenu !== null) {
    return JSON.parse(localStorageMenu);
  } else {
    // If not, check window width
    if (window.innerWidth > 640) {
      return true;
    } else {
      return false;
    }
  }
};
