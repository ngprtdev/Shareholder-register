<template>
  <div>
    <table class="table-auto border-collapse w-full border border-gray-300">
      <thead>
        <tr class="text-left">
          <th class="border-r px-4 py-2 text-center">DATE</th>
          <th class="border-r px-4 py-2 text-center">ÉVÈNEMENT</th>

          <th class="border-r px-4 py-2 text-center">ACTIONNAIRE(S)</th>
          <th class="border-r px-4 py-2 text-center">TYPE</th>
          <th class="px-4 py-2 text-center">QUANTITÉ</th>
        </tr>
      </thead>

      <tbody>
        <RegisterItem
          v-for="event in sortedEvents"
          :key="event.id"
          :event="event"
        />
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { computed, PropType } from "vue";
import RegisterItem from "./RegisterItem.vue";
import { Event } from "../../types/event.types";

export default {
  components: { RegisterItem },
  props: {
    events: {
      type: Array as PropType<Event[]>,
      required: true,
    },
  },

  setup(props) {
    const sortedEvents = computed(() =>
      props.events
        .slice()
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    );

    return {
      sortedEvents,
    };
  },
};
</script>
