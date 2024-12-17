<template>
  <div
    class="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-96 sm:w-[500px]">
      <h3 class="text-xl font-semibold mb-4">Détails de l'événement</h3>

      <div class="mb-2">
        <strong>Type:</strong>
        {{
          event.type === "ISSUANCE"
            ? "Émission"
            : event.type === "EXERCISE"
            ? "Exercice/Acquisition"
            : "Cession"
        }}
      </div>

      <div class="mb-2">
        <strong>Date de l'évènement:</strong>
        {{ event.date.split("T")[0].split("-").reverse().join("-") }}
      </div>

      <div class="mb-2" v-if="event.createdAt">
        <strong>Créé le:</strong>
        {{ event.createdAt.split("T")[0].split("-").reverse().join("-") }}
      </div>

      <div class="mb-2" v-if="event.updatedAt">
        <strong>Modifié le:</strong>
        {{ event.updatedAt.split("T")[0].split("-").reverse().join("-") }}
      </div>

      <div class="mb-2"><strong>Nature:</strong> {{ event.stock }}</div>

      <div class="mb-2"><strong>Quantité:</strong> {{ event.quantity }}</div>

      <div class="mb-2">
        <strong>Prix unitaire:</strong> {{ event.unitPrice }}€
      </div>

      <div v-if="event.type === 'TRANSFER'" class="mb-2">
        <strong>Cédant:</strong> {{ event.data.seller }}
      </div>

      <div v-if="event.type === 'TRANSFER'" class="mb-2">
        <strong>Cessionnaire:</strong> {{ event.data.transferee }}
      </div>

      <div v-if="event.type !== 'TRANSFER'" class="mb-2">
        <strong>Bénéficiaire:</strong> {{ event.data.contact }}
      </div>

      <button
        @click="closeModal"
        class="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
      >
        Fermer
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import { Event } from "../types/event.types";

export default {
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
};
</script>
