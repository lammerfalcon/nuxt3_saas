<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const upload = useUpload('/api/avatars/upload', { multiple: false })
const { loggedIn, user, session, clear } = useUserSession()
const preview = ref('')
async function onFileSelect(file: File) {
  console.log(file[0])
  preview.value = URL.createObjectURL(file[0])
  await upload(file[0])
  await useUserSession().fetch()

  // file uploaded successfully
}
const state = reactive({
  name: undefined,
  password: undefined,
  avatar: undefined
})

const validate = (state: any): FormError[] => {
  const errors = []
  if (!user.value.name) errors.push({ path: 'email', message: 'Required' })
  if (!user.value.avatar) errors.push({ path: 'password', message: 'Required' })
  if (!user.value.avatar) errors.push({ path: 'password', message: 'Required' })
  return errors
}

async function onSubmit(event: FormSubmitEvent<any>) {
  console.log(event.data)
}
</script>

<template>
  <UForm
    :validate="validate"
    :state="user"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormGroup
      label="Name"
      name="name"
    >
      <UInput v-model="user.name" />
    </UFormGroup>

    <UFormGroup
      label="Avatar"
      name="avatar"
    >
      <UAvatar
        :src="`/images/${user.avatar}`"
      />
      <UAvatar
        :src="preview"
      />
      <UInput
        type="file"
        name="file"
        @change="onFileSelect"
      />
    </UFormGroup>

    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>
