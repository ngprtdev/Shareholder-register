<template>
  <form @submit.prevent="submitForm">
    <div>
      <label>Type:</label>
      <select v-model="form.type">
        <option value="ISSUANCE">Souscription / Attribution</option>
        <option value="EXERCISE">Exercice / Acquisition</option>
        <option value="TRANSFER">Cession</option>
      </select>
    </div>

    <div>
      <label>Date:</label>
      <input type="date" v-model="form.date" />
    </div>

    <div>
      <label>Titre:</label>
      <select v-model="form.stock" :disabled="isDisabled">
        <option v-for="option in availableStocks" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </div>

    <div>
      <label>Quantité:</label>
      <input type="number" v-model="form.quantity" min="1" />
    </div>

    <div>
      <label>Prix unitaire:</label>
      <input type="number" v-model="form.unitPrice" min="0" step="0.01" />
    </div>

    <div v-if="form.type === 'TRANSFER'">
      <label>Cédant:</label>
      <input :disabled="isDisabled" type="text" v-model="form.data.seller" />
      <label>Cessionnaire:</label>
      <input
        :disabled="isDisabled"
        type="text"
        v-model="form.data.transferee"
      />
    </div>

    <div v-else>
      <label>Contact:</label>
      <input type="text" v-model="form.data.contact" />
    </div>

    <button type="submit">Sauvegarder</button>
    <button type="button" @click="cancel">Annuler</button>
  </form>
</template>

<script lang="ts">
import { reactive, computed, PropType } from "vue";
import { Event } from "../../types/event.types";

export default {
  props: {
    event: {
      type: Object as PropType<Event | null>,
      required: false,
    },
    eventToEdit: {
      type: Object as PropType<Event | null>,
      required: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const form = reactive<Event>({
      id: props.event ? props.event.id : Date.now().toString(),
      type: props.event ? props.event.type : "ISSUANCE",
      date: props.event ? props.event.date : "",
      stock: props.event ? props.event.stock : "Actions",
      quantity: props.event ? props.event.quantity : 0,
      unitPrice: props.event ? props.event.unitPrice : 0,
      data: {
        contact:
          props.event && props.event.type !== "TRANSFER"
            ? props.event.data.contact
            : "",
        seller:
          props.event && props.event.type === "TRANSFER"
            ? props.event.data.seller
            : "",
        transferee:
          props.event && props.event.type === "TRANSFER"
            ? props.event.data.transferee
            : "",
      },
    });

    const availableStocks = computed(() => {
      switch (form.type) {
        case "ISSUANCE":
          return ["Actions", "BSA", "BSPCE", "AGA"];
        case "EXERCISE":
          return ["BSA", "BSPCE", "AGA"];
        case "TRANSFER":
          return ["Actions", "BSA"];
        default:
          return [];
      }
    });

    const submitForm = () => {
      if (form.type === "TRANSFER") {
        if (!form.data.seller || !form.data.transferee || form.quantity <= 0) {
          console.error("Données invalides pour une cession");
          return;
        }
      }

      const formData = {
        id: form.id,
        type: form.type,
        date: form.date,
        stock: form.stock,
        quantity: form.quantity,
        unitPrice: form.unitPrice,
        contact: form.data.contact,
        seller: form.data.seller,
        transferee: form.data.transferee,
      };
      emit("handleSubmit", formData);
    };

    const cancel = () => {
      emit("cancel");
    };

    return {
      form,
      availableStocks,
      submitForm,
      cancel,
    };
  },
};
</script>
