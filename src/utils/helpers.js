export const includesText = (text, check) => {
  // Check if either text or check is undefined, return false if any of them is undefined
  if (text === undefined || check === undefined) {
    return false;
  }
  const textLower = text?.toLowerCase();
  const checkLower = check?.toLowerCase();

  return textLower?.includes(checkLower);
};

export const hasActiveFilters = (filters) => {
  return (
    filters?.startDate !== '' ||
    filters?.endDate !== '' ||
    filters?.paymentMethod?.length > 0 ||
    filters?.searchTags?.length > 0 ||
    filters?.searchText !== ''
  );
};

export function logWithTimestamp(message = '') {
  const now = new Date();
  const timestamp = now.toISOString(); // Human-readable format with milliseconds
  console.log(`[${timestamp}] ${message}`);
}
