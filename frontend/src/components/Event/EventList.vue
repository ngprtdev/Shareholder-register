<template>
  <div>
    <p v-if="isLoading">Chargement des événements...</p>
    <p v-if="error" class="text-red-500">{{ error }}</p>
    <p v-if="currentEvents.length === 0 && searchQuery.trim()">
      Aucun événement ne correspond à votre recherche.
    </p>
    <p v-else-if="currentEvents.length === 0">Vous n'avez aucun évènement.</p>
    <table v-if="currentEvents.length > 0" class="table-auto border-collapse">
      <EventItem
        v-for="event in currentEvents"
        :key="event.id"
        :event="event"
        @edit="openEditForm"
        @delete="handleDelete"
        @viewDetail="handleViewDetail"
      />
    </table>

    <div
      v-if="sortedEvents.length > eventsPerPage"
      class="flex justify-center items-center gap-4 mt-8"
    >
      <Button
        buttonType="primary"
        @click="handlePreviousPage"
        :disabled="isPreviousDisabled"
        className="px-4 py-2"
      >
        Page précédente
      </Button>
      <p class="font-semibold">{{ currentPage }}</p>
      <Button
        buttonType="primary"
        @click="handleNextPage"
        :disabled="isNextDisabled"
        className="px-4 py-2"
      >
        Page suivante
      </Button>
    </div>

    <DetailsCard
      v-if="showDetails && selectedEvent"
      :event="selectedEvent"
      :closeModal="closeDetailsModal"
    />
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted } from "vue";
import { useEventStore } from "../../stores/eventStore";
import DetailsCard from "../DetailsCard.vue";
import EventItem from "./EventItem.vue";
import Button from "../Button.vue";
import { Event } from "../../types/event.types";

export default {
  components: { EventItem, Button, DetailsCard },
  props: {
    searchQuery: {
      type: String,
      required: false,
      default: "",
    },
  },
  setup(props, { emit }) {
    const eventStore = useEventStore();
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const showDetails = ref(false);
    const selectedEvent = ref<Event | null>(null);

    const currentPage = ref(1);
    const eventsPerPage = 8;

    const filteredEvents = computed(() => {
      if (!props.searchQuery.trim()) {
        return eventStore.events;
      }
      currentPage.value = 1;
      return eventStore.filterEvents(props.searchQuery);
    });

    const sortedEvents = computed(() => {
      const typeOrder = ["ISSUANCE", "TRANSFER", "EXERCISE"];
      return [...filteredEvents.value].sort((a, b) => {
        if (a.date < b.date) return -1;
        if (a.date > b.date) return 1;

        const firstIndex = typeOrder.indexOf(a.type);
        const secondIndex = typeOrder.indexOf(b.type);

        return firstIndex - secondIndex;
      });
    });

    const currentEvents = computed(() => {
      const indexOfLastEvent = currentPage.value * eventsPerPage;
      const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
      return sortedEvents.value.slice(indexOfFirstEvent, indexOfLastEvent);
    });

    const isNextDisabled = computed(() => {
      return currentPage.value * eventsPerPage >= sortedEvents.value.length;
    });

    const isPreviousDisabled = computed(() => currentPage.value === 1);

    const fetchEvents = async () => {
      isLoading.value = true;
      error.value = null;
      try {
        await eventStore.getAllEvents();
      } catch (err) {
        console.error("Erreur lors de la récupération des événements :", err);
        error.value = "Erreur lors de la récupération des événements.";
      } finally {
        isLoading.value = false;
      }
    };

    const openEditForm = (event: Event) => {
      emit("handleEdit", event);
    };

    const handleDelete = (id: string) => {
      eventStore.deleteEvent(id);
    };

    const handleViewDetail = (event: Event) => {
      selectedEvent.value = event;
      showDetails.value = true;
    };

    const closeDetailsModal = () => {
      showDetails.value = false;
      selectedEvent.value = null;
    };

    const handleNextPage = () => {
      if (!isNextDisabled.value) currentPage.value++;
    };

    const handlePreviousPage = () => {
      if (!isPreviousDisabled.value) currentPage.value--;
    };

    onMounted(() => {
      if (!eventStore.isLoaded) {
        fetchEvents();
      }
    });

    return {
      currentEvents,
      sortedEvents,
      isLoading,
      error,
      handleDelete,
      handleViewDetail,
      showDetails,
      selectedEvent,
      closeDetailsModal,
      openEditForm,
      currentPage,
      eventsPerPage,
      isNextDisabled,
      isPreviousDisabled,
      handleNextPage,
      handlePreviousPage,
    };
  },
};
</script>
