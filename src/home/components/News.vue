<template>
  <div class="container-news">
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
        <el-card
          v-for="article in news"
          shadow="never"
          :key="article.id"
          style="margin: 0 auto 20px auto;; max-width : 300px; position : relative; cursor : pointer;"
        >
          <div class="sub-container" @click="$window.open(article.link, '_blank')">
            <div class="article-image">
              <el-image :src="article.image">
                <div slot="placeholder" class="image-slot">
                  <span class="dot">...</span>
                </div>
              </el-image>
            </div>
            <div class="title">
              <h3># {{article.tag.charAt(0).toUpperCase() + article.tag.slice(1)}}</h3>
              <div>{{article.title}}</div>
            </div>
          </div>
        </el-card>
      </div>
      <Loader v-if="subLoading" style="display : flex; margin-bottom : 50px" />
    </div>
  </div>
</template>

<script>
import Loader from "./Loader";
import { mapActions, mapGetters } from "vuex";
import firebase from "@firebase/app";
import "@firebase/firestore";
import { db } from "../../../firebaseConfig";

export default {
  name: "News",
  data() {
    return {
      news: [],
      loading: true,
      cursor: null,
      cursorDone: [],
      subLoading: false,
      noMore: false
    };
  },
  components: {
    Loader
  },
  computed: {
    ...mapGetters(["getters_news", "getters_news_created_at"]),
    disabled() {
      return this.subLoading || this.noMore;
    }
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
      //force fetch every 3hours
      if (
        time_since_last_fetched >= 21600000 &&
        this.getters_news_created_at != null
      ) {
        this.news = this.getters_news;
        this.cursor -= this.getters_news.length;
        this.loading = false;
      } else {
        await this.getMoreNews();
      }
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
      if (this.cursor == 0){
		this.noMore = true
		return 0;
	  }
      try {
		  console.log("from => " , from);
        let snap = await db
          .collection("chromeExtension-articles")
          .orderBy("uid", "desc")
          .startAt(from)
          .limit(6)
          .get();
		let result = snap.docs.map(doc => doc.data()) || [];
        if (result.length) this.news.push(...result);
        this.setNewsCreatedAt();
        this.loading = false;
        return from - result.length;
      } catch (error) {
        console.log(error.message);
      }
    }
  },
  watch: {
    news: function(old, val) {
      this.setNews(val);
    }
  }
};
</script>

<style lang="css" scoped>
@import "../../css/news.css";
</style>