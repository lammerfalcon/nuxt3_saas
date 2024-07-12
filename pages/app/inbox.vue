<script setup lang="ts">
const upload = useUpload('/api/avatars/upload', {multiple: false})

async function onFileSelect({ target }: Event) {
  const uploadedFiles = await upload(target as HTMLInputElement)

  // file uploaded successfully
}
</script>

<template>
  <input
    accept="jpeg, png"
    type="file"
    name="file"
    multiple
    @change="onFileSelect"
  >
</template>
