<template>
  <div class="logo">
    <div class="logo-container">
	  <img v-if="mode_42" class="logo-png" src="./sub-components/logo-42.png" alt="logo-42" />
      <img v-else class="logo-png" src="./sub-components/logo-fusio.png" alt="logo-fusio" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Logo",
  props: {
    mode_42: Boolean
  }
};
</script>
<style lang="css" scoped>
@import "../../css/logo.css";
</style>