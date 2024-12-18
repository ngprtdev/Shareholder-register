<template>
  <button :class="finalClassName" :disabled="disabled" @click="handleClick">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { computed, PropType } from "vue";

export default {
  props: {
    buttonType: {
      type: String as PropType<"primary" | "secondary" | "cancel">,
      required: true,
    },
    className: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click"],
  setup(props, { emit }) {
    const finalClassName = computed(() => {
      const baseStyles = "px-4 py-2 rounded focus:outline-none font-semibold";
      const typeStyles =
        props.buttonType === "primary"
          ? "bg-[#FCA311] text-white hover:bg-[#e59e09] disabled:opacity-50"
          : props.buttonType === "secondary"
          ? "bg-blue-500 text-white hover:bg-blue-800 disabled:opacity-50"
          : "bg-red-500 hover:bg-red-800 text-white";

      return `${baseStyles} ${typeStyles} ${props.className}`;
    });

    const handleClick = (event: Event) => {
      emit("click", event);
    };

    return {
      finalClassName,
      handleClick,
    };
  },
};
</script>
