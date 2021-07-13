<template>
  <div id="app">
    <h1 class="title">Hi {{ username }}! What's in your mind today?</h1>
    <SignInButton
      ref="signInButton"
      @logout="onUserLogout"
      @login="onUserLogin"
    />
    <TaskInput
      v-if="!isMobile()"
      @category-update="onCategoryUpdate"
      @update="onTaskCreated"
    />
    <TaskInputMobile
      v-else
      @category-update="onCategoryUpdate"
      @update="onTaskCreated"
    />
    <TaskDisplay v-if="!isMobile()" ref="taskDisplay" @update="onTaskUpdate" />
    <TaskDisplayMobile v-else ref="taskDisplay" @update="onTaskUpdate" />
    <Shop @update="onShopUpdate" v-if="!isMobile()" />
    <ShopMobile @update="onShopUpdate" v-else />
  </div>
</template>

<script>
import "./styles/Root.scss";

import Shop from "./components/Shop.vue";
import TaskInput from "./components/TaskInput";
import SignInButton from "./components/SignInButton";
import TaskDisplay from "./components/TaskDisplay";

import ShopMobile from "./components/mobile/ShopMobile.vue";
import TaskInputMobile from "./components/mobile/TaskInputMobile.vue";
import TaskDisplayMobile from "./components/mobile/TaskDisplayMobile.vue";

import { deleteCookie, getCookie, setCookie } from "./utils/cookies";
import { mixinDetictingMobile } from "./mixins";

export default {
  components: {
    Shop,
    TaskInput,
    SignInButton,
    TaskDisplay,
    ShopMobile,
    TaskInputMobile,
    TaskDisplayMobile,
  },
  mixins: [mixinDetictingMobile],
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
    if (getCookie("uid") === "demo") {
      this.username = "";
    } else {
      this.username = getCookie("username");
    }
  },
  methods: {
    onUserLogout() {
      deleteCookie("username");
      deleteCookie("token");
      deleteCookie("email");
      setCookie("uid", "demo");
      window.location.reload();
    },
    onUserLogin() {
      window.location.reload();
    },
    onCategoryUpdate(categories) {
      this.$refs.taskDisplay.updateCategories(categories);
    },
    onTaskCreated() {
      this.$refs.taskDisplay.refreshTasks();
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
