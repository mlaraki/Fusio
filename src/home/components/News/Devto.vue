<template>
  <div class="container-news-FCC">
    <div v-if="loading" class="loading">
      <Loader />
    </div>
    <div class="container-articles">
      <div class="container-articles-list infinite-list">
        <Articles v-show="!loading" :news="news" :type="'devto'" />
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import Loader from "../Loader";
import Articles from "./Articles";

export default {
  name: "Devto",
  components: { Loader, Articles },
  data() {
    return {
      loading: false,
      news: [],
    };
  },

  computed: {
    ...mapGetters(["getters_news_devto", "getters_news_devto_created_at"]),
  },
  async created() {
	this.loading = true;
	try {
		await this.setNews_Devto();
	} catch (error){
		console.log("error occured" , error);
		this.news = []
	}
    this.loading = false;
  },
  methods: {
    ...mapActions(["setNews_Devto"]),
  },
    watch: {
	  getters_news_devto: {
		handler(newVal, oldVal) {
			this.news = [...newVal];
		},
		immediate: true
	  }
	}
};
</script>

<style scoped>
</style>