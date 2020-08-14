<template>
  <div class="container-app">
    <div class="display">
      <el-button
        size="mini"
        :class="display == 'console' ? 'toggler-active' : 'toggler'"
        @click="switchDisplay('console')"
      >Console</el-button>
      <el-button
        size="mini"
        :class="display == 'news' ? 'toggler-active' : 'toggler'"
        @click="switchDisplay('news')"
      >News</el-button>
    </div>
    <div class="searchBar">
      <Logo v-if="!display" :mode_42="getters_mode_42" />
      <SearchBar />
    </div>
    <div v-if="!display" class="favorites">
      <Favorites />
    </div>
    <div v-else class="sub-container">
      <div v-if="display == 'news'">
        <News />
      </div>
    </div>
    <div v-show="display == 'console'" class="console-container">
      <div class="repl">
        <iframe
          id="iframe-console"
          src="https://stackblitz.com/edit/js-jvmqjo?embed=1&file=index.js&hideNavigation=1&ctl=1&devtoolsheight=50vh"
          style="width:100%; height:70vh; border:0; border-radius: 4px; overflow:hidden;"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Logo from "./components/Logo";
import SearchBar from "./components/SearchBar";
import Favorites from "./components/Favorites";
import News from "./components/News/News";

export default {
  components: {
    Logo,
    SearchBar,
    Favorites,
    News,
  },
  data() {
    return {
      display: null,
    };
  },
  async created() {
    chrome.runtime.onMessage.addListener(this.updateMode);
  },
  computed: {
    ...mapGetters(["getters_mode_42"]),
  },
  methods: {
    ...mapActions(["setMode"]),
    updateMode({ mode = "Dev" }) {
      this.setMode(mode);
    },
    switchDisplay(type) {
      this.display == type ? (this.display = null) : (this.display = type);
    },
  },
};
</script>

<style lang="css">
@import "./home.css";
</style>