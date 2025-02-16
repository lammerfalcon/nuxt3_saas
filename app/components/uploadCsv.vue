<script setup lang="ts">
import { ref } from 'vue'

const file = ref<File | null>(null)
const prompt = ref('')

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    file.value = target.files[0]
  }
}

async function uploadAndSearch() {
  if (!file.value) return alert('Выберите файл!')

  const formData = new FormData()
  formData.append('file', file.value)
  formData.append('prompt', prompt.value)

  const res = await $fetch('/api/upload-and-search', {
    method: 'POST',
    body: formData
  })
  const data = await res
  console.log('Result', data)
}
</script>

<template>
  <div>
    <h1>Upload CSV & Search</h1>
    <input
      type="file"
      name="file"
      accept=".csv"
      @change="handleFileChange"
    >

    <br><br>
    <input
      v-model="prompt"
      placeholder="Ваш запрос (prompt)"
    >

    <button @click="uploadAndSearch">
      Загрузить и искать
    </button>
  </div>
</template>
