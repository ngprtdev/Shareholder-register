<template>
  <div>
    <h1>Table de capitalisation</h1>
    <table>
      <thead>
        <tr class="grid grid-cols-7">
          <th>Contact</th>
          <th>Actions</th>
          <th>BSA</th>
          <th>BSPCE</th>
          <th>AGA</th>
          <th>% Fully Diluted</th>
          <th>% Non-Fully Diluted</th>
        </tr>
      </thead>
      <tbody>
        <CaptableList :captable="validatedResults" />
      </tbody>
    </table>
    <p v-if="validationError" class="text-red-500 mt-[10px]">
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

    watch(
      () => eventStore.shareholders,
      () => {
        validateCaptable();
      },
      { deep: true, immediate: true }
    );

    onMounted(() => {
      validateCaptable();
    });

    return {
      validatedResults,
      validationError,
    };
  },
};
</script>
