<script setup lang="ts">
import { eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, format } from 'date-fns'
import { VisXYContainer, VisLine, VisAxis, VisCrosshair, VisTooltip } from '@unovis/vue'
import type { Period, Range } from '~/types'

const cardRef = ref<HTMLElement | null>(null)

const props = defineProps({
  period: {
    type: String as PropType<Period>,
    required: true
  },
  range: {
    type: Object as PropType<Range>,
    required: true
  },
  expenses: {
    type: Array as PropType<DataRecord[]>,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
})

type Expense = {
  createdAt: number
  amount: number
  description: string
}

type UserExpense = {
  userId: number
  userName: string
  expenses: Expense[]
}

type DataRecord = {
  date: string
  expensesByUser: UserExpense[]
}

const { width } = useElementSize(cardRef)

// Extract unique user IDs
const userIds = computed(() => {
  const ids = new Set<number>()
  props.expenses.forEach((record) => {
    record.expensesByUser.forEach(userExpense => ids.add(userExpense.userId))
  })
  return Array.from(ids)
})

// Generate Y-series functions for each user
const ySeries = computed(() => {
  return userIds.value.map(userId => (record: DataRecord) => {
    const userExpenses = record.expensesByUser.find(userExpense => userExpense.userId === userId)
    return userExpenses
      ? userExpenses.expenses.reduce((sum, expense) => sum + expense.amount, 0)
      : 0
  })
})

const x = (_: DataRecord, i: number) => i

const formatDate = (date: string): string => format(new Date(date), 'd MMM')

const xTicks = (i: number) => {
  if (i === props.expenses.length) {
    return ''
  }
  return formatDate(props.expenses[i].date)
}

const template = (record: DataRecord) => {
  const formattedDate = format(new Date(record.date), 'dd MMM')
  const userExpenses = record.expensesByUser
    .map(userExpense => `${userExpense.userName}: ${userExpense.expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(1)}`)
    .join('<br>')

  return `<strong>${formattedDate}</strong><br>${userExpenses}`
}
</script>

<template>
  <UDashboardCard
    ref="cardRef"
    :ui="{ body: { padding: '!pb-3 !px-0' } as any }"
  >
    <template #header>
      <div>
        <p class="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">
          Total spend
        </p>
        <p class="text-3xl text-gray-900 dark:text-white font-semibold">
          {{ total }}
        </p>
      </div>
    </template>

    <VisXYContainer
      :data="expenses"
      :padding="{ top: 10 }"
      class="h-64"
      :width="width"
    >
      <!-- Render a line for each user with a unique color -->
      <VisLine
        v-for="(y, index) in ySeries"
        :key="index"
        :x="x"
        :y="y"
        :color="`rgb(var(--color-primary-${(index + 1) * 100}))`"
      />

      <VisAxis
        type="x"
        :x="x"
        :num-ticks="props.expenses.length / 2"
        :tick-format="xTicks"
      />

      <VisCrosshair
        color="rgb(var(--color-primary-500))"
        :template="template"
      />

      <VisTooltip />
    </VisXYContainer>
  </UDashboardCard>
</template>

<style scoped>
.unovis-xy-container {
  --vis-crosshair-line-stroke-color: rgb(var(--color-primary-500));
  --vis-crosshair-circle-stroke-color: #fff;

  --vis-axis-grid-color: rgb(var(--color-gray-200));
  --vis-axis-tick-color: rgb(var(--color-gray-200));
  --vis-axis-tick-label-color: rgb(var(--color-gray-400));

  --vis-tooltip-background-color: #fff;
  --vis-tooltip-border-color: rgb(var(--color-gray-200));
  --vis-tooltip-text-color: rgb(var(--color-gray-900));
}

.dark .unovis-xy-container {
  --vis-crosshair-line-stroke-color: rgb(var(--color-primary-400));
  --vis-crosshair-circle-stroke-color: rgb(var(--color-gray-900));

  --vis-axis-grid-color: rgb(var(--color-gray-800));
  --vis-axis-tick-color: rgb(var(--color-gray-800));
  --vis-axis-tick-label-color: rgb(var(--color-gray-500));

  --vis-tooltip-background-color: rgb(var(--color-gray-900));
  --vis-tooltip-border-color: rgb(var(--color-gray-800));
  --vis-tooltip-text-color: #fff;
}
</style>
