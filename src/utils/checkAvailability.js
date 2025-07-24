export const checkAvailability = (items) => {
  const hasUnavailableItems = items.some((item) => item.available === false);
  return !hasUnavailableItems;
};
