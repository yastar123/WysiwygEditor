import { createStore as createVuexStore } from 'vuex'

export function createStore() {
  return createVuexStore({
    state: {
      editorContent: '',
      currentSelection: null
    },
    mutations: {
      SET_EDITOR_CONTENT(state, content) {
        state.editorContent = content;
      },
      SET_CURRENT_SELECTION(state, selection) {
        state.currentSelection = selection;
      }
    },
    actions: {
      saveEditorContent({ commit }, content) {
        commit('SET_EDITOR_CONTENT', content);
        localStorage.setItem('editorContent', content);
      },
      loadEditorContent({ commit }) {
        const savedContent = localStorage.getItem('editorContent');
        if (savedContent) {
          commit('SET_EDITOR_CONTENT', savedContent);
        }
      }
    },
    getters: {
      editorContent: state => state.editorContent
    }
  })
}
