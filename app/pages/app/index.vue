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

const categorySchema = z.object({
  name: z.string()
})
type categoryFormSchema = z.output<typeof categorySchema>
type Schema = z.output<typeof schema>
const selected = ref(null)

// computed({
//   get: () => selected.value,
//   set: async (label) => {
//     if (!label) return
//     if (typeof label === 'number') {
//       selected.value = label
//     } else {
//       const category = await createCategory(label.name)
//       categories.value?.push(category.result)
//       selected.value = category.result.id
//       categoryInputQuery.value = ''
//     }
//   }
// })
async function createNewCategory(event: FormSubmitEvent<categoryFormSchema>) {
  if (!event.data.name) return
  const category = await createCategory(event.data.name)
  categories.value?.push(category.result)
  state.categoryId = category.result.id
  categoryFormState.name = undefined
  isCreating.value = false
}
const state = reactive({
  amount: undefined,
  description: undefined,
  categoryId: undefined
})
const categoryFormState = reactive({
  name: undefined
})
const { data, refresh } = useFetch('/api/expenses/current-month')
const categoryResponse = useFetch('/api/expenses/by-category')
const categoryData = computed(() => categoryResponse.data.value)
fetchCategories()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await $fetch('/api/expenses', {
      method: 'POST',
      body: event.data
    })
    await refresh()
    await categoryResponse.refresh()
    await spendListsComponentRef.value.refresh()
    selected.value = null
    state.amount = undefined
    state.description = undefined
    state.categoryId = undefined
  } catch (error) {
    console.error(error)
  }
}
const isCreating = ref(false)
const completeButtonRef = ref(null)
const createCategoryInput = ref(null)
function openCreateCategoryModal() {
  isCreating.value = true
  // setTimeout(() => {
  //   createCategoryInput.value?.input.focus()
  // }, 200)
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
          :category-data="categoryData"
          :total="data!.total"
          :period="period"
          :range="range"
        />
        <UModal
          v-model="isCreating"
          :initial-focus="completeButtonRef"
        >
          <UCard>
            <template #header>
              Create new category
            </template>
            <UForm
              :state="categoryFormState"
              :schema="categorySchema"
              class="flex flex-col gap-2"
              @submit="createNewCategory"
            >
              <UFormGroup
                label="Category"
                name="name"
              >
                <UInput
                  ref="createCategoryInput"
                  v-model="categoryFormState.name"
                  size="lg"
                />
              </UFormGroup>
              <UButton
                ref="completeButtonRef"
                class="w-full flex items-center justify-center"
                type="submit"
              >
                Create
              </UButton>
            </UForm>
          </UCard>
        </UModal>
        <div class="grid lg:grid-cols-2 lg:items-start gap-8 mt-8">
          <UForm
            :schema="schema"
            :state="state"
            class="space-y-4"
            :validate-on="['submit']"
            @submit="onSubmit"
          >
            <div class="flex flex-row gap-2 items-start justify-between">
              <UFormGroup
                label="Amount"
                name="amount"
              >
                <UInput
                  v-model.number="state.amount"
                  type="number"
                  size="lg"
                  inputmode="numeric"
                />
              </UFormGroup>
              <UFormGroup
                class="flex-1"
                name="categoryId"
                label="Category"
              >
                <template #hint>
                  <div @click="openCreateCategoryModal">
                    Add new
                  </div>
                </template>
                <USelectMenu
                  v-model="state.categoryId"
                  size="lg"
                  name="labels"
                  :options="categories"
                  option-attribute="name"
                  value-attribute="id"
                  :popper="{ placement: 'top' }"
                  show-create-option-when="always"
                  placeholder="Select category"
                />
              </UFormGroup>
            </div>
            <UFormGroup
              label="Description"
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
