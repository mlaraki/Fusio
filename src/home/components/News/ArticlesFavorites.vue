<template>
  <div class="container-news-FCC">
    <div class="container-articles" v-if="getters_news_favorites.length > 0">
      <div class="container-articles-list infinite-list">
        <Articles :news="getters_news_favorites" />
      </div>
    </div>
    <div v-else>
      <h3 style="text-align : center">You have no favorites yet.</h3>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Articles from "./Articles";

export default {
  name: "ArticlesFavorites",
  components: { Articles },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["getters_news_favorites"]),
  }
};
</script>

<style scoped>
</style>