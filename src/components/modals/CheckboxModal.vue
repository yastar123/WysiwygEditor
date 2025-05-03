<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Add Checkbox Group</h3>
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
        <label class="form-label">Options:</label>
        <div v-for="(option, index) in options" :key="index" class="option-row">
          <input 
            type="text" 
            v-model="options[index].text" 
            class="form-control" 
            placeholder="Option text"
          >
          <label class="checkbox-label">
            <input type="checkbox" v-model="options[index].correct">
            Correct
          </label>
          <button class="btn btn-danger" @click="removeOption(index)">×</button>
        </div>
        <button class="btn btn-secondary" @click="addOption">Add Option</button>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="close">Cancel</button>
        <button class="btn btn-primary" @click="insertCheckbox">Insert</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'CheckboxModal',
  emits: ['close'],
  setup(props, { emit }) {
    const store = useStore();
    const questionNumber = ref('');
    const questionText = ref('');
    const options = ref([{ text: '', correct: false }]);
    
    // Add a new option field
    const addOption = () => {
      options.value.push({ text: '', correct: false });
    };
    
    // Remove an option field
    const removeOption = (index) => {
      if (options.value.length > 1) {
        options.value.splice(index, 1);
      }
    };
    
    // Insert the checkbox group into the editor
    const insertCheckbox = () => {
      if (!questionText.value || options.value.some(opt => !opt.text)) {
        alert('Please fill out all text fields.');
        return;
      }
      
      // Get correct options
      const correctOptions = options.value
        .filter(opt => opt.correct)
        .map(opt => opt.text);
      
      // Create a unique name for the checkbox group
      const checkboxGroupName = `checkbox_${Date.now()}`;
      
      // Create checkbox HTML
      let checkboxHtml = `
        <div class="editor-element" data-type="checkbox" data-correct="${JSON.stringify(correctOptions)}">
          <div class="element-actions">
            <span class="element-action" onclick="this.parentNode.parentNode.remove()">Delete</span>
          </div>
          <p><span class="question-number">${questionNumber.value || ''}.</span> ${questionText.value}</p>
          <div class="checkbox-group">
            ${options.value.map((opt, index) => `
              <div class="checkbox-option">
                <input type="checkbox" name="${checkboxGroupName}" value="${opt.text}" id="${checkboxGroupName}_${index}">
                <label for="${checkboxGroupName}_${index}">${opt.text}</label>
              </div>
            `).join('')}
          </div>
          <div class="answer-feedback"></div>
        </div>
      `;
      
      // Get the current selection
      const selection = store.state.currentSelection;
      
      if (selection) {
        // Create a temporary div to hold our HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = checkboxHtml.trim();
        
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
      options,
      addOption,
      removeOption,
      insertCheckbox,
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
  align-items: center;
}

.option-row .form-control {
  flex: 1;
}

.option-row .btn {
  padding: 0.25rem 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin: 0 0.5rem;
  white-space: nowrap;
}
</style>
