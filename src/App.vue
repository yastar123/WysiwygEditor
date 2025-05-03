<template>
  <div class="container">
    <header class="card">
      <h1>WYSIWYG Editor</h1>
      <p>Create interactive educational forms with various question types and automatic answer validation</p>
    </header>
    
    <main>
      <div class="card">
        <Editor />
      </div>
      
      <div class="card" v-if="editorContent.length > 0">
        <h2>Preview</h2>
        <QuestionPreview />
      </div>
    </main>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import Editor from './components/Editor.vue';
import QuestionPreview from './components/QuestionPreview.vue';

export default {
  name: 'App',
  components: {
    Editor,
    QuestionPreview
  },
  setup() {
    const store = useStore();
    const editorContent = computed(() => store.state.editorContent);

    return {
      editorContent
    };
  }
}
</script>
