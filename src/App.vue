<template>
  <div id="app">
    <h1 class="title">Hi {{ username }}! What's in your mind today?</h1>
    <TaskInput @category-update="onCategoryUpdate" />
    <TaskDisplay ref="taskDisplay" @update="onTaskUpdate" />
    <SignInButton
      ref="signInButton"
      @logout="onUserLogout"
      @login="onUserLogin"
    />
    <Shop @update="onShopUpdate" />
  </div>
</template>

<script>
import "./styles/Root.scss";
import Shop from "./components/Shop.vue";
import TaskInput from "./components/TaskInput";
import SignInButton from "./components/SignInButton";
import TaskDisplay from "./components/TaskDisplay";
import { getCookie } from "./utils/cookies";
export default {
  components: {
    Shop,
    TaskInput,
    SignInButton,
    TaskDisplay,
  },
  data() {
    return {
      username: "",
      colors: [
        "#f2ff7a",
        "#7affb6",
        "#ff7a7a",
        "#7ab8ff",
        "#ff7aff",
        "#f2ff7a",
      ],
    };
  },
  created() {
    this.username = getCookie("username");
  },
  methods: {
    onUserLogout() {
      window.location.reload();
    },
    onUserLogin() {
      window.location.reload();
    },
    onCategoryUpdate(categories) {
      this.$refs.taskDisplay.updateCategories(categories);
    },
    onTaskUpdate() {
      this.$refs.signInButton.refreshProfile();
    },
    onShopUpdate() {
      this.$refs.signInButton.refreshProfile();
    },
  },
};
</script>

<style lang="scss">
@import "./styles/Variables.scss";

@font-face {
  font-family: "ZenLoop";
  src: local("ZenLoop"), url("../src/fonts/ZenLoop-Regular.ttf");
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

html,
body {
  font-family: $font-family;
}

body {
  background-color: $secondary-text-color;
}
</style>
