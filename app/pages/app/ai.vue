<template>
  <form @submit.prevent="submitForm">
    <div>
      <label for="csvFile">Upload CSV File:</label>
      <input
        id="csvFile"
        type="file"
        accept=".csv"
        required
        @change="handleFileChange"
      >
    </div>
    <div>
      <label for="prompt">Enter Filter Prompt:</label>
      <UTextarea
        id="prompt"
        v-model="prompt"
        placeholder="e.g., 'Filter rows where age > 30'"
        required
      />
    </div>
    <UButton type="submit">
      Submit
    </UButton>
  </form>
</template>

<script setup lang="ts">
const file = ref(null)
const prompt = ref('')

const handleFileChange = (event) => {
  file.value = event.target.files[0]
}

const submitForm = async () => {
  if (!file.value || !prompt.value) {
    alert('Please provide both a CSV file and a prompt.')
    return
  }

  const formData = new FormData()
  formData.append('file', file.value)
  formData.append('prompt', prompt.value)

  try {
    const response = await fetch('/api/process-csv', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Failed to process CSV.')
    }

    // Create a link to download the processed CSV
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'filtered.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error:', error)
    alert('An error occurred while processing the CSV.')
  }
}
</script>
