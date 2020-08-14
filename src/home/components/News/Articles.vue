<template>
  <div style="display: contents">
    <el-card
      v-for="article in articles"
      shadow="never"
      :key="article.id"
      style="margin: 0 auto 20px auto;; max-width : 300px; position : relative; cursor : pointer;"
    >
      <div class="sub-container">
        <div class="article-image">
          <div class="container-fav" @click="toggleIsFavorited(article)">
            <span class="fav_icon">
              <Favorite
                :isFavorite="getters_news_favorites.findIndex(art => art.id == article.id) != -1"
              />
            </span>
          </div>
          <el-image
            :src="article.image"
            style="opacity: 0.8;"
            @click="$window.open(article.link, '_blank')"
          >
            <div slot="placeholder" class="image-slot">
              <span class="dot">...</span>
            </div>
          </el-image>
        </div>
        <div class="title" @click="$window.open(article.link, '_blank')">
          <h3>#{{getTags(article)}}</h3>
          <div>{{article.title}}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Loader from "../Loader";
import Favorite from "./Favorites/Favorite";

export default {
  name: "Articles",
  components: { Loader, Favorite },
  props: {
    news: { type: Array, required: true }
  },
  computed: {
    ...mapGetters(["getters_news_favorites"]),
    articles: function () {
      return this.$props.news;
    },
  },
  methods: {
	...mapActions(["toggleNewsFavorites"]),
	//set a filter
    getTags(article) {
      if (article.type === "devto")
        return article.tags
          .split(",")
          .slice(0, 3)
          .map((tag) => {
            tag = tag.trim();
            return tag.charAt(0).toUpperCase() + tag.slice(1);
          })
          .join(" #");
      else if(article.type === 'FCC') return article.tag.charAt(0).toUpperCase() + article.tag.slice(1);
    },
    toggleIsFavorited(article) {
      this.toggleNewsFavorites(article);
    },
  },
};
</script>

<style lang="css" scoped>
@import "../../../css/news.css";
</style>