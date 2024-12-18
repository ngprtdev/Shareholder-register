<template>
  <tr class="hover:bg-gray-50">
    <td class="border px-4 py-2">
      {{ formattedDate }}
    </td>

    <td class="border px-4 py-2">
      <strong v-if="event.type === 'ISSUANCE'">
        {{
          event.stock === "Actions" || event.stock === "BSA"
            ? "Souscription"
            : "Attribution"
        }}
      </strong>
      <strong v-else-if="event.type === 'EXERCISE'">Exercice/Conversion</strong>
      <strong v-else-if="event.type === 'TRANSFER'">Cession</strong>
    </td>

    <td class="border px-4 py-2">{{ event.stock }}</td>

    <td class="border px-4 py-2">
      <span v-if="event.type === 'TRANSFER'">
        {{ event.data.seller }} ➡ {{ event.data.transferee }}
      </span>
      <span v-else>{{ event.data.contact }}</span>
    </td>

    <td class="border px-4 py-2">{{ event.quantity }}</td>

    <td class="border px-4 py-2">{{ event.unitPrice }}€</td>

    <td class="border px-4 py-2 space-x-2">
      <button
        @click="handleViewDetail"
        class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
      >
        Détail
      </button>
      <button
        @click="handleEdit"
        class="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
      >
        Modifier
      </button>
      <button
        @click="handleDelete"
        class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
      >
        Supprimer
      </button>
    </td>
  </tr>
</template>

<script lang="ts">
import { PropType, computed } from "vue";
import { Event } from "../../types/event.types";

export default {
  props: {
    event: {
      type: Object as PropType<Event>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const formattedDate = computed(() =>
      props.event.date.split("T")[0].split("-").reverse().join("-")
    );

    const handleViewDetail = () => {
      emit("viewDetail", props.event);
    };

    const handleEdit = () => {
      emit("edit", props.event);
    };

    const handleDelete = () => {
      emit("delete", props.event.id);
    };

    return {
      formattedDate,
      handleViewDetail,
      handleEdit,
      handleDelete,
    };
  },
};
</script>
