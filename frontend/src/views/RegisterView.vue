<template>
  <div class="max-w-7xl mx-auto mt-8">
    <h1 class="text-2xl font-bold mb-4">Registre des Actionnaires</h1>

    <div v-if="isLoading" class="flex justify-center items-center mt-8">
      <div
        class="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"
      ></div>
    </div>

    <div v-else>
      <RegisterTable :events="sortedRegisterItems" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useEventStore } from "../stores/eventStore.ts";
import { RegisterRow } from "../types/registerRow.ts";
import RegisterTable from "../components/Register/RegisterTable.vue";
import axios from "axios";

export default {
  components: { RegisterTable },
  setup() {
    const eventStore = useEventStore();
    const isLoading = ref(false);

    const registerItems = ref<RegisterRow[]>([]);

    const sortedRegisterItems = computed(() =>
      registerItems.value
        .slice()
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    );

    onMounted(async () => {
      if (!eventStore.isLoaded) {
        try {
          isLoading.value = true;
          await fetchRegisterData();
        } catch (error) {
          console.error("Erreur lors du chargement du registre :", error);
        } finally {
          isLoading.value = false;
        }
      } else {
        isLoading.value = false;
      }
    });

    watch(
      () => eventStore.events,
      async () => {
        await fetchRegisterData();
      },
      { deep: true }
    );

    const fetchRegisterData = async () => {
      isLoading.value = true;
      try {
        const response = await axios.get("http://localhost:3000/register");
        const registerTable = response.data;

        registerItems.value = registerTable;
      } catch (err) {
        console.error("Erreur lors de la récupération des données :", err);
      } finally {
        isLoading.value = false;
      }
    };
    fetchRegisterData();

    return {
      sortedRegisterItems,
      isLoading,
    };
  },
};
</script>
