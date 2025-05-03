/**
 * Utility functions for text formatting
 */

/**
 * Makes the selected text bold
 */
export function formatBold() {
    document.execCommand('bold', false, null);
  }
  
  /**
   * Makes the selected text italic
   */
  export function formatItalic() {
    document.execCommand('italic', false, null);
  }
  
  /**
   * Underlines the selected text
   */
  export function formatUnderline() {
    document.execCommand('underline', false, null);
  }
  
  /**
   * Checks if the current selection has the specified formatting
   * @param {string} command - The formatting command to check
   * @returns {boolean} - Whether the current selection has the specified formatting
   */
  export function hasFormatting(command) {
    return document.queryCommandState(command);
  }
  
  /**
   * Generates a unique ID for form elements
   * @param {string} prefix - A prefix for the ID
   * @returns {string} - A unique ID
   */
  export function generateId(prefix = 'element') {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }
  
  /**
   * Sanitizes a string for use as an ID or class name
   * @param {string} text - The text to sanitize
   * @returns {string} - The sanitized text
   */
  export function sanitizeForId(text) {
    return text.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  }
  