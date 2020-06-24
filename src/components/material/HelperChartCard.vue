<template>
  <v-card
    v-bind="$attrs"
    :style="styles"
    v-on="$listeners"
    style="margin-left: 8px; margin-right: 8px;"
  >
    <helper-offset v-if="hasOffset" :inline="inline" :full-width="fullWidth" :offset="offset">
      <v-card
        v-if="!$slots.offset"
        :color="color"
        :class="`elevation-${elevation}`"
        class="v-card--material__header"
        dark
      >
        <slot v-if="!title && !text" name="header" />
        <span v-else>
          <h4 class="title font-weight-light mb-2" v-text="title" />
          <p class="category font-weight-thin" v-text="text" />
        </span>
      </v-card>
      <slot v-else name="offset" />
    </helper-offset>

    <v-card-text>
      <slot />
    </v-card-text>

    <v-divider v-if="$slots.actions" class="mx-3" />

    <v-card-actions v-if="$slots.actions">
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>

<script>
import HelperOffset from "../helper/Offset";
export default {
  inheritAttrs: false,
  props: {
    color: {
      type: String,
      default: "secondary"
    },
    elevation: {
      type: [Number, String],
      default: 10
    },
    inline: {
      type: Boolean,
      default: false
    },
    fullWidth: {
      type: Boolean,
      default: false
    },
    offset: {
      type: [Number, String],
      default: 24
    },
    title: {
      type: String,
      default: undefined
    },
    text: {
      type: String,
      default: undefined
    }
  },
  computed: {
    hasOffset() {
      return (
        this.$slots.header || this.$slots.offset || this.title || this.text
      );
    },
    styles() {
      if (!this.hasOffset) return null;

      return {
        marginBottom: `${this.offset}px`,
        marginTop: `${this.offset * 2}px`
      };
    }
  },
  components: {
    HelperOffset
  }
};
</script>

<style lang="scss">
.v-card--material {
  &__header {
    &.v-card {
      border-radius: 4px;
    }
  }
}
.v-card.info {
  background: linear-gradient(60deg, #26c6da, #00acc1) !important;
}
.v-card.green {
  background: linear-gradient(60deg, #66bb6a, #43a047) !important;
}
.v-card.orange {
  background: linear-gradient(60deg, #ffa726, #fb8c00) !important;
}
.v-card.red {
  background: linear-gradient(60deg, #ef5350, #e53935) !important;
}
</style>
