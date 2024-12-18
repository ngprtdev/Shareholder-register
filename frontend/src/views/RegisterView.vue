<template>
  <div class="max-w-7xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Registre des Actionnaires</h1>
    <RegisterTable :events="sortedEvents" />
  </div>
</template>

<script lang="ts">
import { computed } from "vue";
import { useEventStore } from "../stores/eventStore.ts";
import RegisterTable from "../components/Register/RegisterTable.vue";

export default {
  components: { RegisterTable },
  setup() {
    const eventStore = useEventStore();

    const events = eventStore.events;

    const sortedEvents = computed(() =>
      events
        .slice()
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    );

    return {
      sortedEvents,
    };
  },
};
</script>
