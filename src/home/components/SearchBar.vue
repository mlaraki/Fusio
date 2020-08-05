<template>
  <div class="searchBar-container">
    <form class="searchBar" @submit.prevent="handleSubmit" method="get">
      <el-autocomplete
        id="searchBar-input"
        class="searchBar-input"
        :popper-class="compute_popper_class"
        prefix-icon="el-icon-search"
        clearable
        v-model="searchTerm"
        :fetch-suggestions="querySearch"
        placeholder="Type ! to use bangs"
        @select="handleSelect"
      >
        <template slot-scope="{ item }">
          <div class="bang_result">
            <div>
              <el-avatar
                class="bang-image"
                shape="square"
                :alt="item.s"
                :src="`https://external-content.duckduckgo.com/i/${item.d}.ico?imgFallback=/watrcoolr/img/search-suggestions_default.png`"
                :size="20"
              ></el-avatar>
            </div>
            <span>{{ item.s }}</span>
            <span style="font-weight: bold; float:right; text-align : end">!{{item.t}}</span>
          </div>
        </template>
      </el-autocomplete>
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
      helper: [],
      bangs_json: null,
      bang: "",
    };
  },
  computed: {
    ...mapGetters(["getters_mode"]),
    compute_popper_class: function () {
      return !this.displayHelper ? "none" : "default";
    },
  },
  methods: {
    querySearch(searchTerm, cb) {
      cb(this.helper);
    },
    handleSelect(item) {
      this.searchTerm = "!" + item.t + " ";
      document.getElementById("searchBar-input").focus();
      this.displayHelper = false;
    },
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
    	window.open(url, "_blank");
    },
    searchJson: _.debounce(function (val) {
      if (this.bangs_json == null) {
        let json = require("./sub-components/bangs_compressed.js");
        this.bangs_json = json.default;
      }
      let str = val.substr(1);
      let res = this.bangs_json.filter((bang) => bang.t.startsWith(str));
      res.sort((a, b) => b.r - a.r);
      this.helper = res.slice(0, 6);
    }, 100),
    addShortcut(bang) {
      this.searchTerm = "!" + bang.t + " ";
      document.getElementById("searchBar-input").focus();
      this.displayHelper = false;
    },
  },
  watch: {
    searchTerm: function (val) {
      if (val.charAt(0) !== "!") {
        return (this.displayHelper = false);
      }
      if (this.searchTerm == "!") {
        this.helper = this.getters_mode == "Dev" ? dev_bangs : chill_bangs;
        this.displayHelper = true;
      } else this.searchJson(val);
    },
  },
};
</script>

<style lang="css" scoped>
@import "../../css/searchBar.css";
</style>