<script setup lang="ts">
import { useUsers } from '~/composables/useUsers'

const { data } = useFetch('/api/expenses/all')

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
          <p class="text-gray-500 dark:text-gray-400">
            {{ new Date(expense.createdAt) }}
          </p>
        </div>
      </div>

      <p class="text-gray-900 dark:text-white font-medium text-lg">
        {{ formatNumber(expense.amount) }}
      </p>
    </NuxtLink>
  </UDashboardCard>
</template>
