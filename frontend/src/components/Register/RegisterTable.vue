<template>
  <div>
    <ul
      class="grid grid-cols-5 text-center"
      v-for="event in sortedEvents"
      :key="event.id"
    >
      <RegisterItem
        :event="event"
        v-if="!(event.type === 'EMISSION' && event.stock === 'AGA')"
      />
    </ul>
  </div>
</template>

<script lang="ts">
import { computed } from "vue";
import RegisterItem from "./RegisterItem.vue";

export default {
  components: { RegisterItem },
  props: {
    events: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const sortedEvents = computed(() =>
      props.events
        .slice()
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    );

    return {
      sortedEvents,
    };
  },
};
</script>
