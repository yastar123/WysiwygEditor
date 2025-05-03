<template>
  <div class="editor-container">
    <h2>WYSIWYG Editor</h2>
    
    <EditorToolbar />
    
    <div
      ref="editorContent"
      class="editor-content"
      contenteditable="true"
      @input="updateContent"
      @keydown="handleKeyDown"
      @mouseup="checkSelection"
    ></div>
    
    <div class="editor-actions">
      <button class="btn" @click="saveContent">Save</button>
      <button class="btn btn-secondary" @click="clearContent">Clear</button>
    </div>
    
    <SelectModal v-if="showSelectModal" @close="showSelectModal = false" />
    <RadioModal v-if="showRadioModal" @close="showRadioModal = false" />
    <CheckboxModal v-if="showCheckboxModal" @close="showCheckboxModal = false" />
    <TextInputModal v-if="showTextInputModal" @close="showTextInputModal = false" />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import EditorToolbar from './EditorToolbar.vue';
import SelectModal from './modals/SelectModal.vue';
import RadioModal from './modals/RadioModal.vue';
import CheckboxModal from './modals/CheckboxModal.vue';
import TextInputModal from './modals/TextInputModal.vue';

export default {
  name: 'Editor',
  components: {
    EditorToolbar,
    SelectModal,
    RadioModal,
    CheckboxModal,
    TextInputModal
  },
  setup() {
    const store = useStore();
    const editorContent = ref(null);
    const showSelectModal = ref(false);
    const showRadioModal = ref(false);
    const showCheckboxModal = ref(false);
    const showTextInputModal = ref(false);
    
    const currentSelection = computed(() => store.state.currentSelection);
    
    // Initialize editor with stored content
    onMounted(() => {
      // Listen for toolbar commands
      window.addEventListener('editorCommand', handleEditorCommand);
      
      // Load saved content if available
      const savedContent = localStorage.getItem('editorContent');
      if (savedContent) {
        editorContent.value.innerHTML = savedContent;
        store.commit('SET_EDITOR_CONTENT', savedContent);
      }
    });
    
    // Update content in store when editor content changes
    const updateContent = () => {
      store.commit('SET_EDITOR_CONTENT', editorContent.value.innerHTML);
    };
    
    // Handle keyboard shortcuts
    const handleKeyDown = (event) => {
      // Bold: Ctrl+B
      if (event.ctrlKey && event.key === 'b') {
        event.preventDefault();
        document.execCommand('bold', false, null);
      }
      // Italic: Ctrl+I
      else if (event.ctrlKey && event.key === 'i') {
        event.preventDefault();
        document.execCommand('italic', false, null);
      }
      // Underline: Ctrl+U
      else if (event.ctrlKey && event.key === 'u') {
        event.preventDefault();
        document.execCommand('underline', false, null);
      }
    };
    
    // Save current selection to store
    const checkSelection = () => {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        store.commit('SET_CURRENT_SELECTION', range);
      }
    };
    
    // Handle editor commands from toolbar
    const handleEditorCommand = (event) => {
      const { command, value } = event.detail;
      
      // Focus the editor
      editorContent.value.focus();
      
      // If we have a saved selection, restore it
      if (currentSelection.value) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(currentSelection.value);
      }
      
      switch (command) {
        case 'bold':
          document.execCommand('bold', false, null);
          break;
        case 'italic':
          document.execCommand('italic', false, null);
          break;
        case 'underline':
          document.execCommand('underline', false, null);
          break;
        case 'insertSelect':
          showSelectModal.value = true;
          break;
        case 'insertRadio':
          showRadioModal.value = true;
          break;
        case 'insertCheckbox':
          showCheckboxModal.value = true;
          break;
        case 'insertTextInput':
          showTextInputModal.value = true;
          break;
        default:
          console.log(`Unknown command: ${command}`);
      }
      
      // Update content after command execution
      updateContent();
    };
    
    // Save content to localStorage
    const saveContent = () => {
      localStorage.setItem('editorContent', editorContent.value.innerHTML);
      alert('Content saved successfully!');
    };
    
    // Clear editor content
    const clearContent = () => {
      if (confirm('Are you sure you want to clear all content?')) {
        editorContent.value.innerHTML = '';
        store.commit('SET_EDITOR_CONTENT', '');
        localStorage.removeItem('editorContent');
      }
    };
    
    return {
      editorContent,
      showSelectModal,
      showRadioModal,
      showCheckboxModal,
      showTextInputModal,
      updateContent,
      handleKeyDown,
      checkSelection,
      saveContent,
      clearContent
    };
  }
};
</script>
