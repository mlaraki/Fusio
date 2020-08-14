<template>
  <div class="container-news">
    <el-tabs v-model="activeTabNews" :strecht="true" class="nav-news">
      <el-tab-pane label="Dev.to" name="devto">
        <keep-alive>
          <Devto v-if="activeTabNews == 'devto'" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="FreeCodeCamp News" name="fcc">
        <keep-alive>
          <FCC v-if="activeTabNews == 'fcc'" />
        </keep-alive>
      </el-tab-pane>
		<el-tab-pane label="🌟 Favorites" name="favorites">
			<ArticlesFavorites/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import FCC from "./FCC";
import Devto from "./Devto";
import ArticlesFavorites from "../News/ArticlesFavorites";

export default {
  name: "News",
  components: { FCC, Devto , ArticlesFavorites},
  data() {
    return {
      activeTabNews: "devto",
    };
  }
};
</script>

<style lang="css" scoped>
@import "../../../css/news.css";
</style>