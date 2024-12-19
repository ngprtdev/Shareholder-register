<template>
  <div
    v-if="event"
    class="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center z-50"
  >
    <div class="p-6 rounded-lg shadow-lg w-96 sm:w-[500px] bg-white">
      <div class="p-6 rounded-lg w-96 sm:w-[500px]">
        <h3 class="text-xl font-semibold mb-4">Détails de l'événement</h3>

        <div class="mb-2 flex gap-4">
          <strong>Type:</strong>
          {{
            event.type === "ISSUANCE"
              ? "Émission"
              : event.type === "EXERCISE"
              ? "Exercice/Acquisition"
              : "Cession"
          }}
        </div>

        <div class="mb-2 flex gap-4">
          <strong>Date de l'évènement:</strong>
          {{ event.date.split("T")[0].split("-").reverse().join("-") }}
        </div>

        <div class="mb-2 flex gap-4" v-if="event.createdAt">
          <strong>Créé le:</strong>
          {{ formatDate(event.createdAt) }}
        </div>

        <div class="mb-2 flex gap-4" v-if="event.updatedAt">
          <strong>Modifié le:</strong>
          {{ formatDate(event.updatedAt) }}
        </div>

        <div class="mb-2 flex gap-4">
          <strong>Nature:</strong> {{ event.stock }}
        </div>

        <div class="mb-2 flex gap-4">
          <strong>Quantité:</strong> {{ event.quantity }}
        </div>

        <div class="mb-2 flex gap-4">
          <strong>Prix unitaire:</strong> {{ event.unitPrice }}€
        </div>

        <div v-if="event.type === 'TRANSFER'" class="mb-2 flex gap-4">
          <strong>Cédant:</strong> {{ event.data.seller }}
        </div>

        <div v-if="event.type === 'TRANSFER'" class="mb-2 flex gap-4">
          <strong>Cessionnaire:</strong> {{ event.data.transferee }}
        </div>

        <div v-if="event.type !== 'TRANSFER'" class="mb-2 flex gap-4">
          <strong>Bénéficiaire:</strong> {{ event.data.contact }}
        </div>

        <Button
          buttonType="cancel"
          @click="closeModal"
          className="mt-4 mr-8 ml-auto block "
        >
          Fermer
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import { Event } from "../types/event.types";
import Button from "./Button.vue";

export default {
  components: { Button },
  props: {
    event: {
      type: Object as PropType<Event>,
      required: true,
    },
    closeModal: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
  setup() {
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      date.setUTCDate(date.getUTCDate() + 1);
      return date.toISOString().split("T")[0].split("-").reverse().join("-");
    };

    return {
      formatDate,
    };
  },
};
</script>
