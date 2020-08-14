<template>
  <div class="container-news-FCC">
    <div v-if="loading" class="loading">
      <Loader />
    </div>
    <div class="container-articles">
      <div
        v-show="!loading"
        class="container-articles-list infinite-list"
        v-infinite-scroll="getNews"
        :infinite-scroll-disabled="disabled"
      >
        <Articles :news="news" :type="'FCC'" />
      </div>
      <Loader v-if="subLoading" style="display : flex; margin-bottom : 50px" />
    </div>
  </div>
</template>

<script>
import Loader from "../Loader";
import Articles from "./Articles";
import { mapActions, mapGetters } from "vuex";
import firebase from "@firebase/app";
import "@firebase/firestore";
import { db } from "../../../../firebaseConfig";

export default {
  name: "FCC",
  data() {
    return {
      news: [],
      loading: true,
      cursor: null,
      cursorDone: [],
      subLoading: false,
      noMore: false,
    };
  },
  components: {
    Loader,
    Articles,
  },
  computed: {
    ...mapGetters(["getters_news", "getters_news_created_at"]),
    disabled() {
      return this.subLoading || this.noMore;
    },
  },
  methods: {
    ...mapActions(["setNews", "setNewsCreatedAt"]),
    async getCursor() {
      try {
        if (this.cursor == null) {
          let doc = await db
            .collection("chromeExtension-articles")
            .doc("cursor")
            .get();
          let { cursor } = doc.data();
          this.cursor = cursor;
        }
      } catch (error) {
        console.log(error.message);
      }
    },
    async getNews() {
      await this.getCursor();
      let time_since_last_fetched = Date.now() - this.getters_news_created_at;
      await this.getMoreNews();
    },
    async getMoreNews() {
      try {
		this.subLoading = true;
        this.cursor = await this.getNewsBash(this.cursor);
        this.subLoading = false;
      } catch (error) {
        console.log(error.message);
      }
    },
    async getNewsBash(from) {
      if (this.cursor == 0) {
        this.noMore = true;
        return 0;
      }
      try {
        let snap = await db
          .collection("chromeExtension-articles")
          .orderBy("uid", "desc")
          .startAt(from)
          .limit(6)
          .get();
        let result = snap.docs.map((doc) => {
			let art = doc.data();
			art.type = 'FCC';
			return art;
		}) || [];
        if (result.length) {
			this.news.push(...result);
		}
        this.setNewsCreatedAt();
        this.loading = false;
        return from - result.length;
      } catch (error) {
        console.log(error.message);
      }
    },
  },
  watch: {
    news: function (old, val) {
      this.setNews(val);
    },
  },
};
</script>

<style lang="css" scoped>
@import "../../../css/news.css";
</style>