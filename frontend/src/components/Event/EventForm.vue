<template>
  <form @submit.prevent="submitForm">
    <div class="mb-2 flex gap-4">
      <label class="font-medium text-lg">Type:</label>
      <select class="font-semibold" v-model="form.type">
        <option value="ISSUANCE">Souscription / Attribution</option>
        <option value="EXERCISE">Exercice / Acquisition</option>
        <option value="TRANSFER">Cession</option>
      </select>
    </div>

    <div class="mb-2 flex gap-4">
      <label class="font-medium text-lg">Date:</label>
      <input class="font-semibold" type="date" v-model="form.date" />
    </div>

    <div class="mb-2 flex gap-4">
      <label class="font-medium text-lg">Titre:</label>
      <select class="font-semibold" v-model="form.stock" :disabled="isDisabled">
        <option v-for="option in availableStocks" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </div>

    <div class="mb-2 flex gap-4">
      <label class="font-medium text-lg">Quantité:</label>
      <input
        class="font-semibold"
        type="number"
        v-model="form.quantity"
        min="1"
      />
    </div>

    <div class="mb-2 flex gap-4">
      <label class="font-medium text-lg">Prix unitaire:</label>
      <input
        class="font-semibold"
        type="number"
        v-model="form.unitPrice"
        min="0"
        step="0.01"
      />
    </div>

    <div class="mb-2 flex flex-col" v-if="form.type === 'TRANSFER'">
      <div class="flex gap-4 mb-2">
        <label class="font-medium text-lg">Cédant:</label>
        <input
          class="font-semibold"
          :disabled="isDisabled"
          type="text"
          v-model="form.data.seller"
          list="shareholders-list"
          placeholder="Sélectionnez ou entrez un cédant"
        />
      </div>
      <div class="flex gap-4">
        <label class="font-medium text-lg">Cessionnaire:</label>
        <input
          class="font-semibold"
          :disabled="isDisabled"
          type="text"
          v-model="form.data.transferee"
          list="shareholders-list"
          placeholder="Sélectionnez ou entrez un cessionnaire"
        />
      </div>
    </div>

    <div v-else class="flex gap-4">
      <label class="font-medium text-lg">Contact:</label>
      <input
        class="font-semibold"
        type="text"
        v-model="form.data.contact"
        list="shareholders-list"
        placeholder="Sélectionnez ou entrez un contact"
      />
    </div>

    <datalist id="shareholders-list">
      <option
        v-for="shareholder in shareholders"
        :key="shareholder.id"
        :value="shareholder.contact"
      />
    </datalist>

    <div class="flex justify-around mt-4">
      <Button buttonType="primary" type="submit">Sauvegarder</Button>
      <Button buttonType="cancel" type="button" @click="cancel">Annuler</Button>
    </div>
  </form>
</template>

<script lang="ts">
import { reactive, computed, PropType } from "vue";
import { Event } from "../../types/event.types";
import Button from "../Button.vue";
import { useEventStore } from "../../stores/eventStore";

export default {
  components: { Button },
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
    const eventStore = useEventStore();

    const formatDateForInput = (date: string): string => {
      return date.split("T")[0];
    };

    const form = reactive<Event>({
      id: props.event ? props.event.id : Date.now().toString(),
      type: props.event ? props.event.type : "ISSUANCE",
      date: props.event ? formatDateForInput(props.event.date) : "",
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

    const shareholders = computed(() => eventStore.shareholders);

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
      shareholders,
      submitForm,
      cancel,
    };
  },
};
</script>
