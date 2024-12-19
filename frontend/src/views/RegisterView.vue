<template>
  <div class="max-w-7xl mx-auto mt-8">
    <h1 class="text-2xl font-bold mb-4">Registre des Actionnaires</h1>

    <div v-if="isLoading" class="flex justify-center items-center mt-8">
      <div
        class="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"
      ></div>
    </div>

    <div v-else>
      <RegisterTable :events="sortedEvents" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted } from "vue";
import { useEventStore } from "../stores/eventStore.ts";
import RegisterTable from "../components/Register/RegisterTable.vue";

export default {
  components: { RegisterTable },
  setup() {
    const eventStore = useEventStore();
    const isLoading = ref(false);

    const events = eventStore.events;

    const sortedEvents = computed(() =>
      events
        .slice()
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    );

    onMounted(async () => {
      if (!eventStore.isLoaded) {
        try {
          isLoading.value = true;
          await eventStore.getAllEvents();
        } catch (error) {
          console.error("Erreur lors du chargement des événements :", error);
        } finally {
          isLoading.value = false;
        }
      } else {
        isLoading.value = false;
      }
    });

    return {
      sortedEvents,
      isLoading,
    };
  },
};
</script>
