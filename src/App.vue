<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Editor Soal (WYSIWYG)</h2>

    <!-- Tombol Insert -->
    <div class="space-x-2 mb-4">
      <button @click="openModal('select')" class="btn">Insert Select</button>
      <button @click="openModal('radio')" class="btn">Insert Radio</button>
      <button @click="openModal('checkbox')" class="btn">Insert Checkbox</button>
      <button @click="openModal('text')" class="btn">Insert Textbox</button>
    </div>

    <!-- Editor Preview -->
    <div class="border p-4 bg-gray-50 mb-6">
      <h3 class="font-semibold">Preview Soal:</h3>
      <div v-for="(q, index) in questions" :key="index" class="my-4">
        <p>{{ q.no }}. {{ q.question }}</p>
        <div v-if="q.type === 'select'">
          <select class="border">
            <option v-for="opt in q.options" :key="opt">{{ opt }}</option>
          </select>
        </div>
        <div v-else-if="q.type === 'radio'">
          <div v-for="opt in q.options" :key="opt">
            <label><input type="radio" disabled /> {{ opt }}</label>
          </div>
        </div>
        <div v-else-if="q.type === 'checkbox'">
          <div v-for="opt in q.options" :key="opt">
            <label><input type="checkbox" disabled /> {{ opt }}</label>
          </div>
        </div>
        <div v-else-if="q.type === 'text'">
          <input type="text" disabled class="border" />
        </div>
      </div>
    </div>

    <!-- Komponen Jawab Soal -->
    <div class="border p-4">
      <h2 class="text-xl font-bold mb-2">Jawab Soal</h2>
      <div v-for="(q, index) in questions" :key="index" class="my-4">
        <p>{{ q.no }}. {{ q.question }}</p>
        <div v-if="q.type === 'select'">
          <select v-model="userAnswers[index]" class="border">
            <option v-for="opt in q.options" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </div>
        <div v-else-if="q.type === 'radio'">
          <div v-for="opt in q.options" :key="opt">
            <label><input type="radio" :name="'radio-' + index" :value="opt" v-model="userAnswers[index]" /> {{ opt }}</label>
          </div>
        </div>
        <div v-else-if="q.type === 'checkbox'">
          <div v-for="opt in q.options" :key="opt">
            <label><input type="checkbox" :value="opt" v-model="userAnswers[index]" /> {{ opt }}</label>
          </div>
        </div>
        <div v-else-if="q.type === 'text'">
          <input type="text" class="border" v-model="userAnswers[index]" />
        </div>
        <p v-if="results.length" :class="results[index] ? 'text-green-600' : 'text-red-600'">
          Soal {{ q.no }}: {{ results[index] ? 'Benar' : 'Salah' }}
        </p>
      </div>
      <button @click="checkAnswers" class="btn bg-blue-600 text-white">Cek Jawaban</button>

      <div v-if="results.length" class="mt-4">
        <p>Total Benar: {{ totalCorrect }}</p>
        <p>Total Salah: {{ questions.length - totalCorrect }}</p>
      </div>
    </div>

    <!-- Modal Input Soal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded w-[400px]">
        <h3 class="text-lg font-bold mb-2">Tambah Soal ({{ form.type }})</h3>
        <input v-model="form.no" placeholder="Nomor Soal" class="input" />
        <input v-model="form.question" placeholder="Pertanyaan" class="input" />
        <div v-if="form.type !== 'text'" class="mb-2">
          <label class="font-medium">Pilihan Jawaban:</label>
          <div v-for="(opt, i) in form.options" :key="i" class="flex gap-2">
            <input v-model="form.options[i]" class="flex-1 input" />
            <button @click="form.options.splice(i,1)" class="text-red-600">✕</button>
          </div>
          <button @click="form.options.push('')" class="text-blue-600 mt-1">+ Tambah Pilihan</button>
        </div>
        <input v-model="form.answer" placeholder="Kunci Jawaban (checkbox pisahkan dengan koma)" class="input" />
        <div class="flex justify-end gap-2 mt-4">
          <button @click="saveQuestion" class="btn bg-green-600 text-white">Simpan</button>
          <button @click="closeModal" class="btn">Batal</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const showModal = ref(false)
const questions = ref([])
const userAnswers = ref([])
const results = ref([])

const form = reactive({
  no: '',
  type: '',
  question: '',
  options: [''],
  answer: ''
})

function openModal(type) {
  form.type = type
  form.no = ''
  form.question = ''
  form.options = ['']
  form.answer = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function saveQuestion() {
  const soal = {
    no: form.no,
    type: form.type,
    question: form.question,
    options: form.type === 'text' ? [] : [...form.options],
    answer: form.answer
  }
  questions.value.push(soal)
  userAnswers.value.push(form.type === 'checkbox' ? [] : '')
  showModal.value = false
}

function checkAnswers() {
  results.value = questions.value.map((q, i) => {
    const user = userAnswers.value[i]
    if (q.type === 'checkbox') {
      const correct = q.answer.split(',').map(v => v.trim()).sort()
      const userAns = [...user].sort()
      return JSON.stringify(userAns) === JSON.stringify(correct)
    } else {
      return user?.toString().trim().toLowerCase() === q.answer.trim().toLowerCase()
    }
  })
}

const totalCorrect = computed(() => results.value.filter(r => r).length)
</script>

<style scoped>
.btn {
  @apply bg-gray-200 px-3 py-1 rounded hover:bg-gray-300;
}
.input {
  @apply border p-2 mb-2 w-full rounded;
}
</style>
