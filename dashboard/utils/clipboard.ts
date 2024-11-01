// utils/clipboard.js

export const copyToClipboard = async (text:string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Text copied to clipboard:', text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };