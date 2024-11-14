<script setup lang="ts">
import { ref, computed } from 'vue'
import { VisSingleContainer, VisDonut, VisTooltip } from '@unovis/vue'
import { Donut } from '@unovis/ts'

const cardRef = ref<HTMLElement | null>(null)

const props = defineProps({
  categoryData: {
    type: Object,
    required: true
  },
  total: {
    type: String,
    required: true
  }
})

const totalAmount = computed(() =>
  props.categoryData?.expenses.reduce((sum, d) => sum + d.totalAmount, 0)
)

// Функция для генерации цветов
const generateColor = (index: number, total: number) => {
  const hue = (index / total) * 360
  return `hsl(${hue}, 65%, 60%)`
}

const categoriesWithDetails = computed(() =>
  props.categoryData?.expenses.map((d, i) => {
    const percentage = (d.totalAmount / totalAmount.value) * 100
    const color = generateColor(i, props.categoryData?.expenses.length)
    return {
      ...d,
      percentage,
      color
    }
  })
)

const value = d => d.totalAmount
const color = d => d.color

const triggers = {
  [Donut.selectors.segment]: d =>
    `${d.data.categoryName}: $${d.data.totalAmount.toFixed(2)}`
}
</script>

<template>
  <UDashboardCard
    ref="cardRef"
    :ui="{ body: { padding: '!pb-3 !px-0' } as any }"
  >
    <template #header>
      <div class="flex flex-row justify-between items-start w-full">
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Total spend
          </p>
          <p class="text-3xl text-gray-900 dark:text-white font-semibold">
            {{ total }}
          </p>
        </div>
      </div>
    </template>
    <VisSingleContainer :data="categoriesWithDetails">
      <VisTooltip :triggers="triggers" />
      <VisDonut
        :pad-angle="0.005"
        :show-empty-segments="true"
        :arc-width="50"
        :radius="120"
        :value="value"
        :color="color"
      />
    </VisSingleContainer>
    <template #footer>
      <div class="flex flex-wrap gap-x-2 items-center">
        <div
          v-for="(data, index) in categoriesWithDetails"
          :key="data.categoryName"
          class="flex items-center mt-2 text-xs"
        >
          <div
            :style="{ backgroundColor: data.color }"
            class="w-4 h-4 mr-2"
          />
          <div>
            {{ data.categoryName }} - {{ data.percentage.toFixed(0) }}%
          </div>
        </div>
      </div>
    </template>
  </UDashboardCard>
</template>

<style scoped>
.unovis-single-container {
  --vis-crosshair-line-stroke-color: rgb(var(--color-primary-500));
  --vis-crosshair-circle-stroke-color: #fff;

  --vis-axis-grid-color: rgb(var(--color-gray-200));
  --vis-axis-tick-color: rgb(var(--color-gray-200));
  --vis-axis-tick-label-color: rgb(var(--color-gray-400));

  --vis-tooltip-background-color: #fff;
  --vis-tooltip-border-color: rgb(var(--color-gray-200));
  --vis-tooltip-text-color: rgb(var(--color-gray-900));

}

.dark .unovis-single-container {
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
