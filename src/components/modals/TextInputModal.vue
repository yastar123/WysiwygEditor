<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Add Text Input</h3>
        <button class="btn btn-secondary" @click="close">×</button>
      </div>
      
      <div class="form-group">
        <label class="form-label">Question Number:</label>
        <input type="number" v-model="questionNumber" class="form-control" placeholder="e.g., 1, 2, 3...">
      </div>
      
      <div class="form-group">
        <label class="form-label">Question Text:</label>
        <input type="text" v-model="questionText" class="form-control" placeholder="Enter question text">
      </div>
      
      <div class="form-group">
        <label class="form-label">Correct Answer:</label>
        <input type="text" v-model="correctAnswer" class="form-control" placeholder="Correct answer">
      </div>
      
      <div class="form-group">
        <label class="form-label">Maximum Characters (0 for unlimited):</label>
        <input type="number" v-model="maxChars" class="form-control" min="0">
      </div>
      
      <div class="form-group">
        <label class="form-label">Placeholder Text:</label>
        <input type="text" v-model="placeholder" class="form-control" placeholder="Enter placeholder text">
      </div>
      
      <div class="form-group">
        <label class="checkbox-label">
          <input type="checkbox" v-model="caseSensitive">
          Case sensitive checking
        </label>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="close">Cancel</button>
        <button class="btn btn-primary" @click="insertTextInput">Insert</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'TextInputModal',
  emits: ['close'],
  setup(props, { emit }) {
    const store = useStore();
    const questionNumber = ref('');
    const questionText = ref('');
    const correctAnswer = ref('');
    const maxChars = ref(0);
    const placeholder = ref('');
    const caseSensitive = ref(false);
    
    // Insert the text input into the editor
    const insertTextInput = () => {
      if (!questionText.value || !correctAnswer.value) {
        alert('Please fill out all required fields.');
        return;
      }
      
      // Create text input HTML
      let textInputHtml = `
        <div class="editor-element" data-type="text" data-correct="${correctAnswer.value}" data-case-sensitive="${caseSensitive.value}">
          <div class="element-actions">
            <span class="element-action" onclick="this.parentNode.parentNode.remove()">Delete</span>
          </div>
          <p><span class="question-number">${questionNumber.value || ''}.</span> ${questionText.value}</p>
          <input type="text" class="form-control text-answer" placeholder="${placeholder.value}" ${maxChars.value > 0 ? `maxlength="${maxChars.value}"` : ''}>
          ${maxChars.value > 0 ? `<div class="limit-notice">Maximum ${maxChars.value} characters</div>` : ''}
          <div class="answer-feedback"></div>
        </div>
      `;
      
      // Get the current selection
      const selection = store.state.currentSelection;
      
      if (selection) {
        // Create a temporary div to hold our HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = textInputHtml.trim();
        
        // Insert the HTML at the current selection
        selection.deleteContents();
        selection.insertNode(tempDiv.firstElementChild);
        
        // Update the editor content in the store
        const editorContent = document.querySelector('.editor-content');
        if (editorContent) {
          store.commit('SET_EDITOR_CONTENT', editorContent.innerHTML);
        }
      }
      
      // Close the modal
      close();
    };
    
    // Close the modal
    const close = () => {
      emit('close');
    };
    
    return {
      questionNumber,
      questionText,
      correctAnswer,
      maxChars,
      placeholder,
      caseSensitive,
      insertTextInput,
      close
    };
  }
};
</script>

<style scoped>
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
