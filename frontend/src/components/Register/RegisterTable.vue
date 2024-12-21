<template>
  <div>
    <table
      class="table-auto border-collapse w-full border-4 border-gray-800 shadow-xl"
    >
      <thead>
        <tr class="text-xl">
          <th class="px-4 py-2 text-center">DATE</th>
          <th class="px-4 py-2 text-center">ÉVÈNEMENT</th>
          <th class="px-4 py-2 text-center">DEBIT</th>
          <th class="px-4 py-2 text-center">CREDIT</th>
          <th class="px-4 py-2 text-center">TYPE</th>
          <th class="px-4 py-2 text-center">QUANTITÉ</th>
        </tr>
      </thead>

      <tbody class="text-lg font-medium">
        <RegisterItem
          v-for="event in currentEvents"
          :key="event.id"
          :event="event"
        />
      </tbody>
    </table>

    <div
      v-if="sortedEvents.length > eventsPerPage"
      class="flex justify-center items-center gap-4 mt-8"
    >
      <Button
        buttonType="primary"
        @click="handlePreviousPage"
        :disabled="isPreviousDisabled"
      >
        Page précédente
      </Button>
      <p class="font-semibold">{{ currentPage }}</p>
      <Button
        buttonType="primary"
        @click="handleNextPage"
        :disabled="isNextDisabled"
      >
        Page suivante
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref, PropType } from "vue";
import RegisterItem from "./RegisterItem.vue";
import Button from "../Button.vue";
import { RegisterRow } from "../../types/registerRow";

export default {
  components: { RegisterItem, Button },
  props: {
    events: {
      type: Array as PropType<RegisterRow[]>,
      required: true,
    },
  },

  setup(props) {
    const currentPage = ref(1);
    const eventsPerPage = 10;

    const sortedEvents = computed(() =>
      props.events
        .slice()
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    );

    const currentEvents = computed(() => {
      const startIndex = (currentPage.value - 1) * eventsPerPage;
      const endIndex = currentPage.value * eventsPerPage;
      return sortedEvents.value.slice(startIndex, endIndex);
    });

    const isNextDisabled = computed(() => {
      return currentPage.value * eventsPerPage >= sortedEvents.value.length;
    });

    const isPreviousDisabled = computed(() => currentPage.value === 1);

    const handleNextPage = () => {
      if (!isNextDisabled.value) currentPage.value++;
    };

    const handlePreviousPage = () => {
      if (!isPreviousDisabled.value) currentPage.value--;
    };

    return {
      currentEvents,
      sortedEvents,
      currentPage,
      eventsPerPage,
      isNextDisabled,
      isPreviousDisabled,
      handleNextPage,
      handlePreviousPage,
    };
  },
};
</script>
