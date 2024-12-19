<template>
  <div class="max-w-7xl mx-auto mt-8">
    <h1 class="text-2xl font-bold mb-4">Table de Capitalisation</h1>

    <div v-if="isLoading" class="flex justify-center items-center mt-8">
      <div
        class="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"
      ></div>
    </div>

    <table
      v-else
      class="w-full table-auto border-collapse border-4 border-gray-800 shadow-xl"
    >
      <thead>
        <tr class="text-center grid grid-cols-7 text-xl font-medium">
          <th class="px-4 py-2">Actionnaire</th>
          <th class="px-4 py-2">Actions</th>
          <th class="px-4 py-2">BSA</th>
          <th class="px-4 py-2">BSPCE</th>
          <th class="px-4 py-2">AGA</th>
          <th class="px-4 py-2">% Fully Diluted</th>
          <th class="py-2">% Non-Fully Diluted</th>
        </tr>
      </thead>
      <tbody class="text-lg font-medium">
        <CaptableList :captable="validatedResults" />
      </tbody>
    </table>

    <p v-if="validationError" class="text-red-500 mt-4">
      {{ validationError }}
    </p>
  </div>
</template>

<script lang="ts">
import { ref, watch, onMounted } from "vue";
import { useEventStore } from "../stores/eventStore";
import CaptableList from "../components/Captable/CaptableList.vue";
import axios from "axios";

export default {
  components: { CaptableList },
  setup() {
    const eventStore = useEventStore();
    const validationError = ref<string | null>(null);
    const validatedResults = ref<any[]>([]);
    const isLoading = ref(false);

    const validateCaptable = async () => {
      try {
        validationError.value = null;

        const captableData = eventStore.shareholders
          .filter(
            (shareholder) =>
              shareholder.Actions > 0 ||
              shareholder.BSA > 0 ||
              shareholder.BSPCE > 0 ||
              shareholder.AGA > 0
          )
          .map((shareholder) => ({
            contact: shareholder.contact,
            titles: [
              { name: "Actions", quantity: shareholder.Actions },
              { name: "BSA", quantity: shareholder.BSA },
              { name: "BSPCE", quantity: shareholder.BSPCE },
              { name: "AGA", quantity: shareholder.AGA },
            ],
            FDQuantity: eventStore.calculateFDPercentage(shareholder),
            NFDQuantity: eventStore.calculateNFDPercentage(shareholder),
          }));

        const result = await axios.post(
          "http://localhost:3000/captable/validate",
          captableData
        );

        validatedResults.value = result.data;
      } catch (error: any) {
        console.error(
          "Erreur lors de la validation :",
          error.response?.data?.message || error.message
        );
        validationError.value =
          error.response?.data?.message ||
          "Erreur lors de la validation des données.";
      }
    };

    watch(() => eventStore.shareholders, validateCaptable, {
      deep: true,
      immediate: true,
    });

    onMounted(async () => {
      if (!eventStore.isLoaded) {
        try {
          isLoading.value = true;
          await eventStore.getAllEvents();
          await validateCaptable();
        } catch (error) {
          console.error("Erreur lors du chargement des événements :", error);
          validationError.value =
            "Erreur lors du chargement initial des événements.";
        } finally {
          isLoading.value = false;
        }
      }
    });

    return {
      isLoading,
      validatedResults,
      validationError,
    };
  },
};
</script>
