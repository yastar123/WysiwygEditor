<template>
  <div class="question-preview-container">
    <div ref="previewContent" class="preview-content" v-html="editorContent"></div>
    
    <div class="preview-actions">
      <button class="btn btn-primary" @click="checkAnswers">Check Answers</button>
      <button class="btn btn-secondary" @click="resetAnswers">Reset</button>
    </div>
    
    <div class="results" v-if="showResults">
      <h3>Results</h3>
      <p>Total Correct: {{ totalCorrect }}</p>
      <p>Total Incorrect: {{ totalIncorrect }}</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'QuestionPreview',
  setup() {
    const store = useStore();
    const previewContent = ref(null);
    const showResults = ref(false);
    const totalCorrect = ref(0);
    const totalIncorrect = ref(0);
    
    const editorContent = computed(() => store.state.editorContent);
    
    // Watch for changes in editor content and reset the preview
    watch(editorContent, () => {
      resetAnswers();
    });
    
    // Initialize event listeners after the component is mounted
    onMounted(() => {
      initializeInputEvents();
    });
    
    // Initialize event listeners for text inputs to handle character limits
    const initializeInputEvents = () => {
      // Wait for the DOM to update
      setTimeout(() => {
        const textInputs = previewContent.value.querySelectorAll('input[type="text"]');
        textInputs.forEach(input => {
          const maxLength = input.getAttribute('maxlength');
          if (maxLength) {
            // Create or update character counter
            let counter = input.nextElementSibling;
            if (!counter || !counter.classList.contains('input-count')) {
              counter = document.createElement('div');
              counter.classList.add('input-count');
              input.parentNode.insertBefore(counter, input.nextSibling);
            }
            
            // Update counter text
            const updateCounter = () => {
              counter.textContent = `${input.value.length}/${maxLength}`;
            };
            
            // Initial update
            updateCounter();
            
            // Add event listener
            input.addEventListener('input', updateCounter);
          }
        });
      }, 100);
    };
    
    // Check all answers in the preview
    const checkAnswers = () => {
      totalCorrect.value = 0;
      totalIncorrect.value = 0;
      
      const elements = previewContent.value.querySelectorAll('.editor-element');
      
      elements.forEach(element => {
        const type = element.getAttribute('data-type');
        const correctData = element.getAttribute('data-correct');
        const feedbackEl = element.querySelector('.answer-feedback');
        
        // Skip if no feedback element is found
        if (!feedbackEl) return;
        
        let isCorrect = false;
        
        switch (type) {
          case 'select':
            const select = element.querySelector('select');
            if (select && select.value === correctData) {
              isCorrect = true;
            }
            break;
            
          case 'radio':
            const checkedRadio = element.querySelector('input[type="radio"]:checked');
            if (checkedRadio && checkedRadio.value === correctData) {
              isCorrect = true;
            }
            break;
            
          case 'checkbox':
            const correctOptions = JSON.parse(correctData);
            const checkedBoxes = Array.from(element.querySelectorAll('input[type="checkbox"]:checked'))
              .map(cb => cb.value);
            
            // Check if all correct options are checked and no incorrect ones
            isCorrect = correctOptions.length === checkedBoxes.length &&
              correctOptions.every(opt => checkedBoxes.includes(opt));
            break;
            
          case 'text':
            const textInput = element.querySelector('input[type="text"]');
            const caseSensitive = element.getAttribute('data-case-sensitive') === 'true';
            
            if (textInput) {
              const userAnswer = textInput.value;
              const correctAnswer = correctData;
              
              if (caseSensitive) {
                isCorrect = userAnswer === correctAnswer;
              } else {
                isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
              }
            }
            break;
        }
        
        // Update feedback display
        feedbackEl.textContent = isCorrect ? 'Benar' : 'Salah';
        feedbackEl.className = 'answer-feedback ' + (isCorrect ? 'answer-correct' : 'answer-incorrect');
        
        // Update totals
        if (isCorrect) {
          totalCorrect.value++;
        } else {
          totalIncorrect.value++;
        }
      });
      
      showResults.value = true;
    };
    
    // Reset all answers and feedback
    const resetAnswers = () => {
      showResults.value = false;
      
      // Wait for the DOM to update
      setTimeout(() => {
        if (!previewContent.value) return;
        
        // Reset selects
        const selects = previewContent.value.querySelectorAll('select');
        selects.forEach(select => {
          select.selectedIndex = 0;
        });
        
        // Reset radio buttons and checkboxes
        const inputs = previewContent.value.querySelectorAll('input[type="radio"], input[type="checkbox"]');
        inputs.forEach(input => {
          input.checked = false;
        });
        
        // Reset text inputs
        const textInputs = previewContent.value.querySelectorAll('input[type="text"]');
        textInputs.forEach(input => {
          input.value = '';
          
          // Reset character counter if it exists
          const counter = input.nextElementSibling;
          if (counter && counter.classList.contains('input-count')) {
            const maxLength = input.getAttribute('maxlength');
            if (maxLength) {
              counter.textContent = `0/${maxLength}`;
            }
          }
        });
        
        // Clear feedback messages
        const feedbacks = previewContent.value.querySelectorAll('.answer-feedback');
        feedbacks.forEach(feedback => {
          feedback.textContent = '';
          feedback.className = 'answer-feedback';
        });
        
        // Reinitialize input events
        initializeInputEvents();
      }, 100);
    };
    
    return {
      previewContent,
      editorContent,
      showResults,
      totalCorrect,
      totalIncorrect,
      checkAnswers,
      resetAnswers
    };
  }
};
</script>

<style scoped>
.preview-content {
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: white;
}

.preview-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.results {
  background-color: var(--light-gray);
  padding: 1rem;
  border-radius: 0.25rem;
  margin-top: 1rem;
}
</style>
