<template>
  <u-button @click="createPayment">
    proceed
  </u-button>
</template>

<script setup>
async function createPayment() {
  const { data } = await useFetch('/api/payment')
  console.log(data.value.data.confirmation.confirmation_url)
  navigateTo(data.value.data.confirmation.confirmation_url, { external: true })
}
</script>
