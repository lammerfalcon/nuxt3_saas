<script setup lang="ts">
import { sub } from 'date-fns'
import type { Period, Range } from '~/types'

const { isNotificationsSlideoverOpen } = useDashboard()
const items = [[{
  label: 'New mail',
  icon: 'i-heroicons-paper-airplane',
  to: '/inbox'
}, {
  label: 'New user',
  icon: 'i-heroicons-user-plus',
  to: '/users'
}]]

const range = ref<Range>({ start: sub(new Date(), { days: 14 }), end: new Date() })
const period = ref<Period>('daily')
// Wallet address
const walletAddress = 'TK5mpbH9VqskkrhrDYzSbqHakMCHsQSJR1'

// Function to get transactions from TRON Grid
async function getTronWalletTransactions(walletAddress) {
  const url = `https://api.trongrid.io/v1/accounts/${walletAddress}/transactions/trc20?limit=200`
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText)
    }
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return null
  }
}

// Function to filter incoming USDT transactions
function filterIncomingUSDTTransactions(transactions) {
  return transactions.filter((transaction) => {
    return transaction.token_info.symbol === 'USDT' && transaction.from === walletAddress
  })
}

// Main function to fetch and filter transactions
async function main() {
  let total = 0
  const transactions = await getTronWalletTransactions(walletAddress)
  if (transactions) {
    const incomingUSDTTransactions = filterIncomingUSDTTransactions(transactions)
    incomingUSDTTransactions.forEach((transaction) => {
      total += transaction.value / 1e6
      console.log(`Date: ${new Date(transaction.block_timestamp).toISOString()}, Amount: ${transaction.value / 1e6} USDT`)
    })
  } else {
    console.log('No transactions found or error in fetching data.')
  }
  console.log(total, 'total')
}

main()
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Home">
        <template #right>
          <UTooltip
            text="Notifications"
            :shortcuts="['N']"
          >
            <UButton
              color="gray"
              variant="ghost"
              square
              @click="isNotificationsSlideoverOpen = true"
            >
              <UChip
                color="red"
                inset
              >
                <UIcon
                  name="i-heroicons-bell"
                  class="w-5 h-5"
                />
              </UChip>
            </UButton>
          </UTooltip>

          <UDropdown :items="items">
            <UButton
              icon="i-heroicons-plus"
              size="md"
              class="ml-1.5 rounded-full"
            />
          </UDropdown>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <!-- ~/components/home/HomeDateRangePicker.vue -->
          <HomeDateRangePicker
            v-model="range"
            class="-ml-2.5"
          />

          <!-- ~/components/home/HomePeriodSelect.vue -->
          <HomePeriodSelect
            v-model="period"
            :range="range"
          />
        </template>
      </UDashboardToolbar>

      <UDashboardPanelContent>
        <!-- ~/components/home/HomeChart.vue -->
        <HomeChart
          :period="period"
          :range="range"
        />

        <div class="grid lg:grid-cols-2 lg:items-start gap-8 mt-8">
          <!-- ~/components/home/HomeSales.vue -->
          <HomeSales />
          <!-- ~/components/home/HomeCountries.vue -->
          <HomeCountries />
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
