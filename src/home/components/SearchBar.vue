<template>
  <div class="searchBar-container">
    <form class="searchBar" @submit.prevent="handleSubmit" method="get">
      <el-input
        id="searchBar-input"
        class="searchBar-input"
        prefix-icon="el-icon-search"
        clearable
        v-model="searchTerm"
      ></el-input>
      <el-card class="bang-card" v-if="displayHelper && helper" shadow="never">
        <el-card
          class="bang-sub-card"
          v-for="(bang, i) in helper"
          :key="i"
          @click.native="addShortcut(bang)"
        >
          <div>
            <el-avatar
              class="bang-image"
              shape="square"
              :alt="bang.s"
              :src="`https://external-content.duckduckgo.com/i/${bang.d}.ico?imgFallback=/watrcoolr/img/search-suggestions_default.png`"
              :size="16"
            ></el-avatar>
          </div>
          <span>{{bang.s}}</span>
          <span style="font-weight: bold; float:right">{{bang.t}}</span>
        </el-card>
      </el-card>
    </form>
  </div>
</template>

<script>
var _ = require("lodash/function");
import { mapGetters } from "vuex";
import dev_bangs from "./sub-components/default_dev_bangs.js";
import chill_bangs from "./sub-components/default_chill_bangs.js";

export default {
  name: "SearchBar",
  data() {
    return {
      searchTerm: "",
      displayHelper: false,
      helper: null,
      bangs_json: null,
      bang: ""
    };
  },
  computed: {
    ...mapGetters(["getters_mode"])
  },
  methods: {
    handleSubmit() {
      if (this.searchTerm.charAt(0) == "!") this.handleBang();
      else this.openURL("https://www.google.com/search?q=" + this.searchTerm);
      this.searchTerm = "";
    },
    handleBang() {
      let bang = "";
      let search = this.searchTerm.substr(1);
      search.replace(" ", "+");
      this.openURL(`https://duckduckgo.com/?q=%21${search}&t=hj`);
    },
    openURL(url) {
      var win = window.open(url, "_self");
    },
    searchJson: _.debounce(function(val) {
      if (this.bangs_json == null) {
        let json = require("./sub-components/bangs_compressed.js");
        this.bangs_json = json.default;
      }
      let str = val.substr(1);
      let res = this.bangs_json.filter(bang => bang.t.startsWith(str));
      res.sort((a, b) => b.r - a.r);
      this.helper = res.slice(0, 6);
    }, 200),
    addShortcut(bang) {
      this.searchTerm = "!" + bang.t + " ";
      document.getElementById("searchBar-input").focus();
      this.displayHelper = false;
    }
  },
  watch: {
    searchTerm: function(val) {
      if (val.charAt(0) == "!" && !val.includes(" ")) {
        if (this.searchTerm == "!") {
          //TODO: add chill if chill mode activated
          this.helper = this.getters_mode == "Dev" ? dev_bangs : chill_bangs;
          this.displayHelper = true;
        } else this.searchJson(val);
      } else this.displayHelper = false;
    }
  }
};
</script>

<style lang="css" scoped>
@import "../../css/searchBar.css";
</style>