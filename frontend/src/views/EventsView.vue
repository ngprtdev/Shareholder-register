<template>
  <div class="max-w-7xl mx-auto mt-8">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Gestion des Événements</h1>
      <div class="flex gap-2 items-center">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher par contact, type, stock ou date"
          class="px-4 py-2 border rounded w-96 text-black"
        />
      </div>
      <Button buttonType="primary" @click="openCreateForm">
        Ajouter un événement
      </Button>
    </div>
    <EventList
      :searchQuery="searchQuery"
      @handleEdit="openEditForm"
      @viewDetail="openViewDetailForm"
    />

    <div
      v-if="showForm"
      class="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="p-6 rounded-lg shadow-lg w-96 sm:w-[500px] bg-white">
        <EventForm
          @cancel="closeForm"
          @HandleSubmit="submitEvent"
          :event="eventToEdit ? eventToEdit : null"
          :isDisabled="eventToEdit ? true : false"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { useEventStore } from "../stores/eventStore";
import EventList from "../components/Event/EventList.vue";
import EventForm from "../components/Event/EventForm.vue";
import Button from "../components/Button.vue";
import { Event } from "../types/event.types";

export default {
  components: {
    EventList,
    EventForm,
    Button,
  },
  setup() {
    const eventStore = useEventStore();
    const showForm = ref(false);
    const eventToEdit = ref<Event | null>(null);
    const searchQuery = ref("");

    const openCreateForm = () => {
      showForm.value = true;
    };

    const openEditForm = (event: Event) => {
      eventToEdit.value = event;
      showForm.value = true;
    };

    const openViewDetailForm = (event: Event) => {
      eventToEdit.value = event;
      showForm.value = true;
    };

    const closeForm = () => {
      showForm.value = false;
      eventToEdit.value = null;
    };

    const submitEvent = (eventData: any) => {
      if (eventToEdit.value) {
        const formData = {
          id: eventData.id,
          type: eventData.type,
          date: eventData.date,
          stock: eventData.stock,
          quantity: eventData.quantity,
          unitPrice: eventData.unitPrice,
          data: {
            contact: eventData.contact,
            seller: eventData.seller,
            transferee: eventData.transferee,
          },
        };
        eventStore.updateEvent(formData);
      } else {
        eventStore.addEvent(eventData);
      }
      closeForm();
    };

    return {
      showForm,
      searchQuery,
      openCreateForm,
      openEditForm,
      openViewDetailForm,
      eventToEdit,
      closeForm,
      submitEvent,
    };
  },
};
</script>
