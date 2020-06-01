<template>
  <div class="container-popup">
    <div>
      <p>Select a Mode :</p>
    </div>
    <div class="radio">
      <el-radio-group :value="getters_mode" @change="updateMode" size="mini">
        <el-radio-button label="Dev"></el-radio-button>
        <el-radio-button label="Chill"></el-radio-button>
      </el-radio-group>
    </div>
    <div class="source-code">
      <p>Full source-code :</p>
      <div @click="openGithubRepo" class="github-icon">
        <el-avatar size="small" src="chrome://favicon/size/16/https://www.github.com"></el-avatar>
      </div>
    </div>
    <div class="credits">
      <el-collapse v-model="isCreditsActive">
        <el-collapse-item title="Credits">
          <div class="credits-content">
            <p>
              <span class="credits-type">Author :</span>
              <a href="https://github.com/mlaraki/" target="_blank" class="credits-ref">
                mlaraki
                <el-avatar size="small" src="chrome://favicon/size/16/https://www.github.com"></el-avatar>
              </a>
            </p>
            <p>
              <span class="credits-type">News :</span>
              <a href="https://www.freecodecamp.org/news" target="_blank" class="credits-ref">
                <el-avatar
                  size="small"
                  src="chrome://favicon/size/16/https://www.freecodecamp.org/news"
                ></el-avatar>
              </a>
            </p>
            <p>
              <span class="credits-type">Bangs list :</span>
              <a href="https://duckduckgo.com/" target="_blank" class="credits-ref">
                <el-avatar size="small" src="chrome://favicon/size/16/https://duckduckgo.com/"></el-avatar>
              </a>
            </p>
            <p>
              <span class="credits-type">Search :</span>
              <a href="https://www.google.com" target="_blank" class="credits-ref">
                <el-avatar size="small" src="chrome://favicon/size/16/https://www.google.com"></el-avatar>
              </a>
            </p>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      isCreditsActive: false
    };
  },
  computed: {
    ...mapGetters(["getters_mode"])
  },
  methods: {
    ...mapActions(["setMode"]),
    updateMode(prev) {
      let val = prev == "Dev" ? "Chill" : "Dev";
	  this.setMode(val);
	  chrome.runtime.sendMessage({mode: val});
    },
    openGithubRepo() {
      window.open("https://github.com/mlaraki/Fusio");
    }
  }
};
</script>

<style lang="css">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.container-popup {
  min-width: 170px;
  padding: 20px;
}
.radio {
  display: flex;
  justify-content: center;
  margin-top: 5px;
}
.source-code {
  margin-top: 15px;
  display: flex;
}
.github-icon {
  margin-left: 5px;
  cursor: pointer;
}
.credits {
  margin-top: 10px;
}
.credits .el-collapse-item__header {
  font-size: inherit;
  font-weight: inherit;
  height: 15px;
  color: inherit;
  line-height: 15px;
  background-color: inherit;
  border: none;
}
.credits .el-collapse {
  border: none;
}
.credits .el-collapse-item__wrap {
  background-color: #1c1c1cd1;
  padding-bottom: 0px;
}
.credits-content {
  margin-top: 5px;
}
.credits-content .el-avatar {
  vertical-align: text-top;
}
.credits-ref {
  cursor: pointer;
  color: inherit;
  text-decoration: none;
}
</style>
