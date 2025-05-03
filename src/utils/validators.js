/**
 * Utility functions for form validation
 */

/**
 * Validates a text input against the correct answer
 * @param {string} userAnswer - The user's answer
 * @param {string} correctAnswer - The correct answer
 * @param {boolean} caseSensitive - Whether to check case-sensitivity
 * @returns {boolean} - Whether the answer is correct
 */
export function validateTextAnswer(userAnswer, correctAnswer, caseSensitive = false) {
    if (!userAnswer || !correctAnswer) return false;
    
    if (caseSensitive) {
      return userAnswer === correctAnswer;
    } else {
      return userAnswer.toLowerCase() === correctAnswer.toLowerCase();
    }
  }
  
  /**
   * Validates a select input against the correct answer
   * @param {string} selectedOption - The selected option
   * @param {string} correctOption - The correct option
   * @returns {boolean} - Whether the answer is correct
   */
  export function validateSelectAnswer(selectedOption, correctOption) {
    return selectedOption === correctOption;
  }
  
  /**
   * Validates a radio input against the correct answer
   * @param {string} selectedOption - The selected option
   * @param {string} correctOption - The correct option
   * @returns {boolean} - Whether the answer is correct
   */
  export function validateRadioAnswer(selectedOption, correctOption) {
    return selectedOption === correctOption;
  }
  
  /**
   * Validates checkbox inputs against the correct answers
   * @param {Array} selectedOptions - Array of selected options
   * @param {Array} correctOptions - Array of correct options
   * @returns {boolean} - Whether the answer is correct
   */
  export function validateCheckboxAnswer(selectedOptions, correctOptions) {
    if (!selectedOptions || !correctOptions) return false;
    
    // Check if arrays have the same length
    if (selectedOptions.length !== correctOptions.length) return false;
    
    // Check if all correct options are selected
    return correctOptions.every(option => selectedOptions.includes(option));
  }
  
  /**
   * Validates that text input doesn't exceed maximum length
   * @param {string} text - The text to validate
   * @param {number} maxLength - The maximum allowed length
   * @returns {boolean} - Whether the text is within the limit
   */
  export function validateMaxLength(text, maxLength) {
    if (!maxLength || maxLength <= 0) return true;
    return text.length <= maxLength;
  }
  