<template>
  <div class="max-w-7xl mx-auto mt-8">
    <h1 class="text-2xl font-bold mb-4">Table de Capitalisation</h1>

    <table class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="text-center grid grid-cols-7">
          <th class="border px-4 py-2">Actionnaire</th>
          <th class="border px-4 py-2">Actions</th>
          <th class="border px-4 py-2">BSA</th>
          <th class="border px-4 py-2">BSPCE</th>
          <th class="border px-4 py-2">AGA</th>
          <th class="border px-4 py-2">% Fully Diluted</th>
          <th class="border py-2">% Non-Fully Diluted</th>
        </tr>
      </thead>
      <tbody>
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

    onMounted(validateCaptable);

    return {
      validatedResults,
      validationError,
    };
  },
};
</script>
