<script setup lang="ts">
const upload = useUpload('/api/avatars/upload', { multiple: false })
const { loggedIn, user, session, clear } = useUserSession()

async function onFileSelect({ target }: Event) {
  const uploadedFiles = await upload(target as HTMLInputElement)

  // file uploaded successfully
}
</script>

<template>
  <img
    :src="`/images/${user.avatar}`"
    alt=""
  >

  <input
    accept="jpeg, png"
    type="file"
    name="file"
    multiple
    @change="onFileSelect"
  >
</template>
