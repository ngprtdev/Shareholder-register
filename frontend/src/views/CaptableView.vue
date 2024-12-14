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
        <CaptableList :captable="captable" />
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { computed } from "vue";
import { useEventStore } from "../stores/eventStore";
import CaptableList from "../components/Captable/CaptableList.vue";

export default {
  components: { CaptableList },
  setup() {
    const eventStore = useEventStore();

    const captable = computed(() => {
      return eventStore.shareholders
        .filter(
          (shareholder) =>
            shareholder.Actions > 0 ||
            shareholder.BSA > 0 ||
            shareholder.BSPCE > 0 ||
            shareholder.AGA > 0
        )
        .map((shareholder) => {
          const FDPercentage = eventStore.calculateFDPercentage(shareholder);
          const NFDPercentage = eventStore.calculateNFDPercentage(shareholder);

          return {
            contact: shareholder.contact,
            actions: shareholder.Actions,
            BSA: shareholder.BSA,
            BSPCE: shareholder.BSPCE,
            AGA: shareholder.AGA,
            FDPercentage,
            NFDPercentage,
          };
        });
    });

    return {
      captable,
    };
  },
};
</script>
