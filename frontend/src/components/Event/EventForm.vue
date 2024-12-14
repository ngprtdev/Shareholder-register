<template>
  <form @submit.prevent="submitForm">
    <div>
      <label>Type:</label>
      <select v-model="form.type">
        <option value="EMISSION">Émission</option>
        <option value="EXERCICE">Exercice/Conversion</option>
        <option value="CESSION">Cession</option>
      </select>
    </div>

    <div>
      <label>Date:</label>
      <input type="date" v-model="form.date" />
    </div>

    <div>
      <label>Titre:</label>
      <select v-model="form.stock">
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

    <div v-if="form.type === 'CESSION'">
      <label>Cédant:</label>
      <input :disabled="isDisabled" type="text" v-model="form.seller" />
      <label>Cessionnaire:</label>
      <input :disabled="isDisabled" type="text" v-model="form.transferee" />
    </div>

    <div v-else>
      <label>Contact:</label>
      <input type="text" v-model="form.contact" />
    </div>

    <button type="submit">Sauvegarder</button>
    <button type="button" @click="cancel">Annuler</button>
  </form>
</template>

<script lang="ts">
import { reactive, toRefs, computed } from "vue";
import { Event } from "../../types/event.types";

export default {
  props: {
    event: {
      type: Object as PropType<Event | null>,
      required: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    console.log("eventToEdit in EventForm", props.eventToEdit);
    const form = reactive<Event>({
      id: props.event ? props.event.id : Date.now().toString(),
      type: props.event ? props.event.type : "EMISSION",
      date: props.event ? props.event.date : "",
      stock: props.event ? props.event.stock : "Actions",
      quantity: props.event ? props.event.quantity : 0,
      unitPrice: props.event ? props.event.unitPrice : 0,
      contact: props.event ? props.event.contact : "",
      seller: props.event ? props.event.seller : "",
      transferee: props.event ? props.event.transferee : "",
    });

    const availableStocks = computed(() => {
      switch (form.type) {
        case "EMISSION":
          return ["Actions", "BSA", "BSPCE", "AGA"];
        case "EXERCICE":
          return ["BSA", "BSPCE", "AGA"];
        case "CESSION":
          return ["Actions", "BSA"];
        default:
          return [];
      }
    });

    const submitForm = () => {
      event.preventDefault();
      event.stopPropagation();
      if (form.type === "CESSION") {
        if (!form.seller || !form.transferee || form.quantity <= 0) {
          console.error("Données invalides pour une cession");
          return;
        }
      }
      console.log("form in submitForm", form);
      emit("handleSubmit", { ...form });
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
