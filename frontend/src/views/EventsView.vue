<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Gestion des Événements</h1>
    <EventList @handleEdit="openEditForm" @viewDetail="openViewDetailForm" />
    <button
      @click="openCreateForm"
      class="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
    >
      Créer un événement
    </button>

    <div
      v-if="showForm"
      class="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-96 sm:w-[500px]">
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
import { Event } from "../types/event.types";

export default {
  components: {
    EventList,
    EventForm,
  },
  setup() {
    const eventStore = useEventStore();
    const showForm = ref(false);
    const eventToEdit = ref<Event | null>(null);

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
