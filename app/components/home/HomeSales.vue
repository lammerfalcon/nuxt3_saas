<script setup lang="ts">
import { useUsers } from '~/composables/useUsers'

const { categories } = useCategories()
const { data, refresh } = useFetch('/api/expenses/all')
defineExpose({
  refresh
})
const formatNumber = new Intl.NumberFormat('en', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format
const { fetchUsers, users } = useUsers()
await fetchUsers()
</script>

<template>
  <UDashboardCard
    title="Recent spends"
    :description="`You made ${data?.length} purchases this month.`"
    icon="i-heroicons-chart-bar-20-solid"
  >
    <NuxtLink
      v-for="(expense, index) in data"
      :key="index"
      class="px-3 py-2 -mx-2 last:-mb-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer flex items-center gap-3 relative"
    >

      <div class="text-sm flex-1">
        <div>
          <p class="text-gray-900 dark:text-white font-medium">
            {{ users?.find(({ id }) => id === expense?.userId)?.name }}
          </p>
          <div class="flex flex-row gap-2">

            <p class="text-gray-500 dark:text-gray-400 text-md">
              {{ new Date(expense.createdAt).toLocaleDateString('Ru-ru') }}
            </p>
            <p class="text-gray-900 dark:text-white font-medium text-md">
              {{ categories.find(({ id }) => id === expense.categoryId)?.name }}
            </p>
          </div>
        </div>
      </div>

      <p class="text-gray-900 dark:text-white font-medium text-lg">
        {{ formatNumber(expense.amount) }}
      </p>
    </NuxtLink>
  </UDashboardCard>
</template>
