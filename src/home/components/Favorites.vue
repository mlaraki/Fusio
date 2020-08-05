<template>
  <div class="container-favorites">
    <div>
      <draggable class="sub-container-fav" :list="favorites" :move="checkMove">
        <div
          style="height: 91px"
          v-for="(fav, index) in favorites"
          :key="index"
          @mouseenter="displayEllipsis(index)"
          @mouseleave="hideEllipsis(index)"
        >
          <div
            v-if="fav.type != 'add'"
            class="card-container"
            @click="$window.open(fav.url, '_self')"
          >
            <el-card class="fav" shadow="hover">
              <div class="container-icon">
                <button
                  @click.stop="openDialogUpdateFav(index)"
                  class="ellipsis"
                  :id="'ellipsis-' + index"
                  style="display : none"
                >
                  <Ellipsis />
                </button>
                <el-avatar
                  class="fav-icon"
                  :src="'chrome://favicon/size/32/' + fav.url"
                  :alt="fav.name"
                ></el-avatar>
              </div>
              <div class="container-icon-name">
                <p>{{fav.name}}</p>
              </div>
            </el-card>
          </div>
          <!-- add favorite -->
          <div
            v-else-if="favorites.length <= 8"
            class="card-container"
            @click="dialogAddFav = true"
          >
            <el-card class="fav" shadow="hover">
              <div class="container-icon">
                <el-avatar class="fav-icon" style="margin-top : 11px">
                  <i class="el-icon-plus" style="font-size : larger"></i>
                </el-avatar>
              </div>
              <div class="container-icon-name"></div>
            </el-card>
          </div>
          <!-- !add favorite -->
        </div>
      </draggable>
    </div>
    <!-- form - update -->
    <el-dialog
      id="dialogUpdateFav"
      title="Update Favorite"
      :visible.sync="dialogUpdateFav"
      width="40%"
    >
      <el-form ref="formUpdate" :model="favForm" size="mini" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="favForm.name"></el-input>
        </el-form-item>
        <el-form-item label="URL">
          <el-input v-model="favForm.url"></el-input>
        </el-form-item>
        <el-form-item class="form-footer">
          <el-button style="float: left" @click="favFormOnDelete">Delete</el-button>
          <el-button style="float: right" type="primary" @click="favFormOnSubmit">Confirm</el-button>
          <el-button style="float: right" @click="dialogUpdateFav = false">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- !form - update -->
    <!-- form - add -->
    <el-dialog title="Add Favorite" :visible.sync="dialogAddFav" width="40%">
      <el-form ref="formAdd" :model="favForm" size="mini" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="favForm.name"></el-input>
        </el-form-item>
        <el-form-item label="URL">
          <el-input v-model="favForm.url"></el-input>
        </el-form-item>
        <el-form-item class="form-footer add">
          <el-button @click="dialogAddFav = false">Cancel</el-button>
          <el-button type="primary" @click="favFormAddOnSubmit" :disabled="checkForm">Confirm</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- !form - add -->
  </div>
</template>

<script>
import Ellipsis from "../components/sub-components/Ellipsis";
import draggable from "vuedraggable";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Favorites",
  components: {
    Ellipsis,
    draggable
  },
  data() {
    return {
      hover: false,
      favorites: [],
      dialogUpdateFav: false,
      dialogAddFav: false,
      favForm: {
        index: "",
        name: "",
        url: ""
      }
    };
  },
  created() {
    this.initFavorites();
  },
  mounted() {
    let cards = document.getElementsByClassName("el-card__body");
    cards.forEach(card => {
      card.style.height = "auto";
    });
  },
  computed: {
    ...mapGetters([
      "getters_favorites",
      "getters_favorites_set",
      "getters_default_favorites",
      "getters_mode"
    ]),
    checkForm: function() {
      return this.favForm.url && this.favForm.name ? false : true;
    }
  },
  methods: {
    ...mapActions(["setFavorites"]),
    initFavorites() {
      if (this.getters_favorites.length == 0 && !this.getters_favorites_set)
        this.favorites = this.getters_default_favorites;
      else this.favorites = this.getters_favorites;
    },
    checkMove(e) {
      return !e.draggedContext.element.type && !e.relatedContext.element.type;
    },
    displayEllipsis(index) {
      let el = document.getElementById(`ellipsis-${index}`);
      if (el) el.style.display = "block";
    },
    hideEllipsis(index) {
      let el = document.getElementById(`ellipsis-${index}`);
      if (el) el.style.display = "none";
    },
    openDialogUpdateFav(index) {
      this.dialogUpdateFav = true;
      this.favForm.index = index;
      this.favForm.name = this.favorites[index].name;
      this.favForm.url = this.favorites[index].url;
    },
    favFormOnSubmit() {
      let { index } = this.favForm;
      let updatedFav = [...this.favorites];
      if (updatedFav[index]) {
        updatedFav[index].name = this.favForm.name;
        updatedFav[index].url = this.favForm.url;
      }

      Object.keys(this.favForm).forEach(key => (this.favForm[key] = ""));
      this.favorites = updatedFav;
      this.dialogUpdateFav = false;
    },
    favFormOnDelete() {
      let { index } = this.favForm;
      this.favorites.splice(index, 1);
      Object.keys(this.favForm).forEach(key => (this.favForm[key] = ""));
      this.dialogUpdateFav = false;
    },
    favFormAddOnSubmit() {
      let index = this.favorites.length - 1;
      let { name, url } = this.favForm;
      this.favorites.splice(index, 0, { index, name, url });
      Object.keys(this.favForm).forEach(key => (this.favForm[key] = ""));
      this.dialogAddFav = false;
    }
  },
  watch: {
    favorites: function(val) {
      this.setFavorites(val);
    },
    getters_mode: function(val) {
      this.initFavorites();
    }
  }
};
</script>

<style lang="css" scoped>
@import "../../css/favorites.css";
</style>