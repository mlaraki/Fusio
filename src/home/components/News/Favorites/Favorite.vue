<template>
  <div>
    <div v-if="isFavorite">
      <IconFavorited />
    </div>
    <div v-else>
      <IconNotFavorited />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import IconFavorited from "./IconFavorited";
import IconNotFavorited from "./IconNotFavorited";

export default {
  name: "Favorite",
  props: {
    isFavorite: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    IconFavorited,
    IconNotFavorited,
  },
  computed: {
    favorited: function () {
      return this.$props.isFavorite;
    },
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
</style>