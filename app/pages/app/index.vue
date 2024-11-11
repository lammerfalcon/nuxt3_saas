<script setup lang="ts">
import { sub } from 'date-fns'
import { z } from 'zod'
import type { Period, Range } from '~/types'
import type { FormSubmitEvent } from '#ui/types'
import { useUsers } from '~/composables/useUsers'

const { fetchCategories, categories, createCategory } = useCategories()
const { fetchUsers } = useUsers()

const { isNotificationsSlideoverOpen } = useDashboard()
const spendListsComponentRef = ref()
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
  description: z.string().nullish(),
  categoryId: z.number().nullish()
})

type Schema = z.output<typeof schema>
const selected = ref(null)

const state = reactive({
  amount: undefined,
  description: undefined,
  categoryId: computed({
    get: () => selected.value,
    set: async (label) => {
      if (typeof label === 'number') {
        selected.value = label
      } else {
        const category = await createCategory(label.name)
        categories.value?.push(category.result)
        selected.value = category.result.id
      }
    }
  })
})
const { data, refresh } = useFetch('/api/expenses/current-month')
fetchCategories()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await $fetch('/api/expenses', {
      method: 'POST',
      body: event.data
    })
    await refresh()
    await spendListsComponentRef.value.refresh()
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
            <div class="flex flex-row gap-2 items-center justify-between">
              <UFormGroup
                label="amount"
                name="amount"
              >
                <UInput
                  v-model.number="state.amount"

                  size="lg"
                  inputmode="numeric"
                />
              </UFormGroup>
              <UFormGroup
                class="flex-1"
                label="description"
                name="description"
              >
                <USelectMenu
                  v-model="state.categoryId"
                  size="lg"
                  name="labels"
                  :options="categories"
                  option-attribute="name"
                  value-attribute="id"
                  searchable
                  creatable
                  show-create-option-when="always"
                  placeholder="Select category"
                />
              </UFormGroup>
            </div>
            <UFormGroup
              label="description"
              name="description"
            >
              <UInput
                v-model="state.description"

                size="lg"
              />
            </UFormGroup>

            <UButton
              size="xl"
              class="w-full items-center mx-auto flex text-center"
              type="submit"
            >
              Submit
            </UButton>
          </UForm>
          <!-- ~/components/home/HomeSales.vue -->
          <HomeSales ref="spendListsComponentRef" />
          <!-- ~/components/home/HomeCountries.vue -->
          <!--          <HomeCountries /> -->
        </div>
        <!--        <UButton @click="useFetch('/api/seed')"> -->
        <!--          seed -->
        <!--        </UButton> -->
        <!--        <UButton @click="useFetch('/api/expenses/all')"> -->
        <!--          seed -->
        <!--        </UButton> -->
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
