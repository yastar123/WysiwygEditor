<template>
  <div class="toolbar">
    <button 
      class="toolbar-button" 
      :class="{ active: isBold }"
      @click="executeCommand('bold')"
      title="Bold"
    >
      <i class="fas fa-bold"></i>
    </button>
    
    <button 
      class="toolbar-button" 
      :class="{ active: isItalic }"
      @click="executeCommand('italic')"
      title="Italic"
    >
      <i class="fas fa-italic"></i>
    </button>
    
    <button 
      class="toolbar-button" 
      :class="{ active: isUnderline }"
      @click="executeCommand('underline')"
      title="Underline"
    >
      <i class="fas fa-underline"></i>
    </button>
    
    <div class="toolbar-divider"></div>
    
    <button 
      class="toolbar-button" 
      @click="executeCommand('insertSelect')"
      title="Insert Select Dropdown"
    >
      Insert Select
    </button>
    
    <button 
      class="toolbar-button" 
      @click="executeCommand('insertRadio')"
      title="Insert Radio Button"
    >
      Insert Radio Button
    </button>
    
    <button 
      class="toolbar-button" 
      @click="executeCommand('insertCheckbox')"
      title="Insert Checkbox"
    >
      Insert Checkbox
    </button>
    
    <button 
      class="toolbar-button" 
      @click="executeCommand('insertTextInput')"
      title="Insert Text Input"
    >
      Insert Text Input
    </button>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
  name: 'EditorToolbar',
  setup() {
    const isBold = ref(false);
    const isItalic = ref(false);
    const isUnderline = ref(false);
    
    // Execute editor command
    const executeCommand = (command, value = null) => {
      // Dispatch a custom event that will be caught by the Editor component
      window.dispatchEvent(
        new CustomEvent('editorCommand', {
          detail: { command, value }
        })
      );
    };
    
    // Update formatting status based on current selection
    const updateFormattingStatus = () => {
      isBold.value = document.queryCommandState('bold');
      isItalic.value = document.queryCommandState('italic');
      isUnderline.value = document.queryCommandState('underline');
    };
    
    // Set up event listeners
    onMounted(() => {
      document.addEventListener('selectionchange', updateFormattingStatus);
      document.addEventListener('mouseup', updateFormattingStatus);
      document.addEventListener('keyup', updateFormattingStatus);
    });
    
    // Clean up event listeners
    onBeforeUnmount(() => {
      document.removeEventListener('selectionchange', updateFormattingStatus);
      document.removeEventListener('mouseup', updateFormattingStatus);
      document.removeEventListener('keyup', updateFormattingStatus);
    });
    
    return {
      isBold,
      isItalic,
      isUnderline,
      executeCommand
    };
  }
};
</script>

<style scoped>
.toolbar-divider {
  width: 1px;
  background-color: var(--border-color);
  height: 24px;
  margin: 0 0.5rem;
}
</style>
