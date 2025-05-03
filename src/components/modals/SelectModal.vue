<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Add New Select</h3>
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
        <input type="text" v-model="correctAnswer" class="form-control" placeholder="Correct option value">
      </div>
      
      <div class="form-group">
        <label class="form-label">Options:</label>
        <div v-for="(option, index) in options" :key="index" class="option-row">
          <input 
            type="text" 
            v-model="options[index]" 
            class="form-control" 
            placeholder="Option text"
          >
          <button class="btn btn-danger" @click="removeOption(index)">×</button>
        </div>
        <button class="btn btn-secondary" @click="addOption">Add Option</button>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="close">Cancel</button>
        <button class="btn btn-primary" @click="insertSelect">Insert</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'SelectModal',
  emits: ['close'],
  setup(props, { emit }) {
    const store = useStore();
    const questionNumber = ref('');
    const questionText = ref('');
    const correctAnswer = ref('');
    const options = ref(['']);
    
    // Add a new option field
    const addOption = () => {
      options.value.push('');
    };
    
    // Remove an option field
    const removeOption = (index) => {
      if (options.value.length > 1) {
        options.value.splice(index, 1);
      }
    };
    
    // Insert the select element into the editor
    const insertSelect = () => {
      if (!questionText.value || options.value.some(opt => !opt)) {
        alert('Please fill out all fields.');
        return;
      }
      
      // Create select HTML
      let selectHtml = `
        <div class="editor-element" data-type="select" data-correct="${correctAnswer.value}">
          <div class="element-actions">
            <span class="element-action" onclick="this.parentNode.parentNode.remove()">Delete</span>
          </div>
          <p><span class="question-number">${questionNumber.value || ''}.</span> ${questionText.value}</p>
          <select class="form-control select-answer" data-question="${questionNumber.value || ''}">
            <option value="">-- Select an option --</option>
            ${options.value.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
          </select>
          <div class="answer-feedback"></div>
        </div>
      `;
      
      // Get the current selection
      const selection = store.state.currentSelection;
      
      if (selection) {
        // Create a temporary div to hold our HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = selectHtml.trim();
        
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
      options,
      addOption,
      removeOption,
      insertSelect,
      close
    };
  }
};
</script>

<style scoped>
.option-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.option-row .form-control {
  flex: 1;
}

.option-row .btn {
  padding: 0.25rem 0.5rem;
}
</style>