<script setup lang="ts">
import { sub } from 'date-fns'
import { z } from 'zod'
import type { Period, Range } from '~/types'
import type { FormSubmitEvent } from '#ui/types'

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

const schema = z.object({
  amount: z.number(),
  description: z.string().nullish()
})

type Schema = z.output<typeof schema>

const state = reactive({
  amount: undefined,
  description: undefined
})
const { data, refresh } = useFetch('/api/expenses/current-month')
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await $fetch('/api/expenses', {
      method: 'POST',
      body: event.data
    })
    await refresh()
  } catch (error) {
    console.error(error)
  }
}
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

      <!--      <UDashboardToolbar> -->
      <!--        <template #left> -->
      <!--          &lt;!&ndash; ~/components/home/HomeDateRangePicker.vue &ndash;&gt; -->
      <!--          <HomeDateRangePicker -->
      <!--            v-model="range" -->
      <!--            class="-ml-2.5" -->
      <!--          /> -->

      <!--          &lt;!&ndash; ~/components/home/HomePeriodSelect.vue &ndash;&gt; -->
      <!--          <HomePeriodSelect -->
      <!--            v-model="period" -->
      <!--            :range="range" -->
      <!--          /> -->
      <!--        </template> -->
      <!--      </UDashboardToolbar> -->

      <UDashboardPanelContent>
        <!-- ~/components/home/HomeChart.vue -->
        <HomeChart
          v-if="data?.expenses"
          :expenses="data!.expenses"
          :total="data!.total"
          :period="period"
          :range="range"
        />
        <div class="grid lg:grid-cols-2 lg:items-start gap-8 mt-8">
          <UForm
            :schema="schema"
            :state="state"
            class="space-y-4"
            @submit="onSubmit"
          >
            <UFormGroup
              label="amount"
              name="amount"
            >
              <UInput
                v-model.number="state.amount"
                inputmode="numeric"
              />
            </UFormGroup>

            <UFormGroup
              label="description"
              name="description"
            >
              <UInput
                v-model="state.description"
              />
            </UFormGroup>

            <UButton
              size="xl"
              class="w-full"
              type="submit"
            >
              Submit
            </UButton>
          </UForm>
          <!-- ~/components/home/HomeSales.vue -->
          <!--          <HomeSales /> -->
          <!-- ~/components/home/HomeCountries.vue -->
          <!--          <HomeCountries /> -->
        </div>
        <!--        <UButton @click="useFetch('/api/seed')"> -->
        <!--          seed -->
        <!--        </UButton> -->
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
