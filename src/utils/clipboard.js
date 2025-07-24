// clipboard.js
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    console.log(`Copied to clipboard: ${text}`);
    return true; // Return true if successful
  } catch (err) {
    console.error(`Failed to copy: ${err}`);
    return false; // Return false if there's an error
  }
};
